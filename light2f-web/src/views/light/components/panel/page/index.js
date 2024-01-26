import { useEffect, useCallback, useMemo, useState } from 'react'
import ApiMasterplatePage from 'services/masterplate_page'
import ApiPage from 'services/page'
import { cloneDeep } from 'lodash'
import { Dialog, Form } from 'freedomen'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { Tree, Divider, Modal, message, Spin, Dropdown, Button, Alert } from 'antd'
import { getUpdateNestedParams, getRouterPath, parseURLParams } from 'libs/utils'
import { useDispatch, useSelector } from 'react-redux'
import { confirmUpdatePage, resetPage, setLoginPage, setNestedList, setPageInfo, setSelectPageAndReplacePath } from 'slices/pageSlice'
import { setLight } from 'slices/loadingSlice'
import { initSelectPage } from '..'
import { masterplatePageId } from 'components/columns'
import { setDesignListChange } from 'slices/eventSlice'
import { getSplitParams, getSubString, pagesHasPath } from 'views/light/utils/util'
import { defaultCompletions } from '../component/renders'
import classNames from 'classnames'
import { useIKnow } from 'hooks'
import history from 'libs/history'
import styles from './index.module.less'
import { HttpErrorData } from 'libs/axios'
import Bus, { BUS_KEYS } from 'views/light/bus'
import { DocDialogName } from 'views/light/config'
import { renderCode } from 'components/codeText'
import user from 'libs/user'
const sqlStr = `CREATE TABLE \`grade\`  (
  \`grade_id\` int(11) NOT NULL AUTO_INCREMENT,
  \`student_id\` int(11) NULL DEFAULT NULL,
  \`grade_name\` varchar(64) CHARACTER NULL DEFAULT NULL COMMENT '考试名称',
  \`grade_chinese\` float NULL DEFAULT NULL COMMENT '语文成绩',
  \`grade_math\` float NULL DEFAULT NULL COMMENT '数学成绩',
  \`grade_english\` float NULL DEFAULT NULL COMMENT '英文成绩',
  \`created_at\` datetime NULL DEFAULT CURRENT_TIMESTAMP,
  \`deleted\` tinyint(2) NULL DEFAULT 0,
  PRIMARY KEY (\`grade_id\`) USING BTREE
) COMMENT = '成绩管理' ROW_FORMAT = Dynamic;`

const javaStr = `public class PagePO {
  //主键
  private Integer pageId;
  //项目ID
  private Integer projectId;
  //页面名称
  private String pageName;
  //文件名称
  private String pageFileName; 
}`

const txtStr = `用户名 username string
密码 password string
年龄 age number
出生日期 birthday date`

const inputConfig = { maxLength: 25 }
//保存查询的结果，防止每次新建都查
var defaultParams = null
function findPage(nestedPages, pageId) {
  for (let item of nestedPages) {
    if (item.pageId === pageId) {
      return item
    } else if (item.children?.length) {
      const page = findPage(item.children, pageId)
      if (page) {
        return page
      }
    }
  }
  return null;
}
//找上一级页面
function findParentPage(pageId, pages, parent) {
  for (let item of pages) {
    if (item.pageId === pageId) {
      return parent
    } else if (item.children) {
      let p = findParentPage(pageId, item.children, item)
      if (p) { return p }
    }
  }
  return null;
}
//{ name: 'rintp', value: 'intp', score: 1, meta: '正整数' },
function setRouteDes(routeDes, nestedPages, prePath = '') {
  for (let page of nestedPages) {
    if (page?.children.length) {
      setRouteDes(routeDes, page.children, prePath + page.pageRouter + '/')
    } else {
      const value = prePath + page.pageRouter

      const info = {
        value,
        name: value,
        score: 1,
        meta: page.pageName
      }
      routeDes.push(info)
    }
  }
}

const iknowKey = 'iknowdragmenu'

export default function Index(props) {
  const { simple } = props
  const { projectName, projectId, masterplateProject } = useSelector(state => state.project)
  const { designListChange } = useSelector(state => state.event)
  const { hasPermission } = useSelector(state => state.temporary)
  const { selectPage, nestedList, loginPage, userDevProjectMenuPaths } = useSelector(state => state.page)
  const { light } = useSelector(state => state.loading)
  const [waitLoadOnce, setWaitLoadOnce] = useState(false)
  const routerState = parseURLParams()
  const [loading, setLoading] = useState()
  const dispatch = useDispatch()
  const shouldSave = useMemo(() => designListChange.uuid !== null && hasPermission, [designListChange.uuid, hasPermission])

  const { iKnow, confirm } = useIKnow(iknowKey)

  const defaultExpandedKeys = useMemo(() => {
    if (selectPage.pageId && nestedList.length) {
      const parent = findParentPage(selectPage.pageId, nestedList)
      if (parent) {
        return [parent.pageId]
      }
    }
    return []
  }, [selectPage.pageId, nestedList])
  //第一次初始化加载page, 其它其时是不加载的
  const loadData = useCallback((nextPage) => {
    const needUpdate = nextPage && nextPage.pageId === selectPage.pageId
    if (needUpdate) {
      dispatch(setLight(true))
    }
    setLoading(true)
    Promise.all([
      ApiPage.selectNested({ projectId }),
      ApiPage.selectLogin({ projectId })
    ]).then(resps => {
      setLoading(false)
      const [res, lp] = resps

      setRouteDes(defaultCompletions.routerCompletions, res)
      if (needUpdate) {
        const page = findPage(res, nextPage.pageId)
        if (page) {
          dispatch(setPageInfo(page))
        } else {
          //被刪除了  
          setSelectPageAndReplacePath(dispatch, initSelectPage)
          dispatch(resetPage())
          dispatch(setLight(false))
        }
      } else {
        dispatch(setLight(false))
      }
      dispatch(setNestedList(res))
      //login page info
      dispatch(setLoginPage(lp))
    })
  }, [dispatch, selectPage, projectId])

  const appendNewPage = useCallback((setBody, params) => {
    if (defaultParams === null) {
      setBody(<Spin />)
      ApiMasterplatePage.defaultId().then(masterplatePageId => {
        ApiPage.tableNames({ projectId }).then(res => {
          defaultParams = {
            masterplatePageId: masterplatePageId === HttpErrorData ? undefined : masterplatePageId,
            connect: !!res
          }
          setBody(pageForm({ pageHidden: 1, ...defaultParams, ...params }))
        })
      })
    } else {
      setBody(pageForm({ pageHidden: 1, ...defaultParams, ...params }))
    }
  }, [projectId])
  //加载页面
  useEffect(() => {
    projectId && loadData()
  }, [projectId])

  const hasMenu = useCallback((page) => {
    const pagePathMap = Bus.get(BUS_KEYS.routeIdPath) || {}

    if (userDevProjectMenuPaths) {
      return pagesHasPath([page], pagePathMap, userDevProjectMenuPaths)
    }
    return true
  }, [userDevProjectMenuPaths])

  const treeNodes = useCallback((data) => {
    const getMenu = (item) => {
      return {
        items: [{ key: '0', label: '添加子页面' }, { key: '1', label: '编辑' }, { key: '2', label: '删除', danger: true, }],
        onClick({ key }) {
          if (key === '0') {
            Dialog.open('pageDialog', { title: `添加(${item.pageName})子页面`, width: 1180 }).then(setBody => {
              appendNewPage(setBody, { parentId: item.pageId })
            })
          } else if (key === '1') {
            Dialog.open('pageDialog', { title: `编辑页面(${item.pageName})`, width: 600 }).then(s => {
              s(pageForm(cloneDeep(item)))
            })
          } else if (key === '2') {
            if (item.children && item.children.length) {
              message.error('有子页面不可以删除!')
            } else {
              Modal.confirm({
                content: '确认删除此页面？',
                onOk() {
                  dispatch(setLight(true))
                  ApiPage.delete([item]).then(_ => {
                    //如果是当前在编辑的页面，就不用保存了
                    if (item.pageId === selectPage.pageId) {
                      dispatch(setDesignListChange({ uuid: null }))
                    }

                    loadData(item)
                  })
                }
              })
            }
          }
        }
      }
    }

    let newData = []
    for (let item of data) {
      let newItem = {
        key: item.pageId,
        title: <div style={{ display: "flex" }}>
          <div className="text-ellipsis" style={{
            flex: 1,
            color: item.pageHidden === 1 ? '#555' : '#ccc',
            width: 140,
            textDecoration: hasMenu(item) ? undefined : "line-through"
          }}
            title={item.pageName}>
            {item.pageName}
          </div>
          {!simple && hasPermission && <div onClick={e => e.stopPropagation()} >
            <Dropdown menu={getMenu(item)} >
              <PlusOutlined style={{ marginTop: 3, marginRight: 2, color: '#555' }} />
            </Dropdown>
          </div>}
        </div>,
        ...item,
      }
      if (item.children && item.children.length) {
        newItem.children = treeNodes(item.children)
      }
      newData.push(newItem)
    }
    return newData
  }, [projectId, selectPage, hasPermission, simple, hasMenu])

  const usePages = useMemo(() => {
    if (nestedList.length) {
      setWaitLoadOnce(true)
      return treeNodes(nestedList)
    }
    return []
  }, [nestedList, treeNodes])

  const data = [...usePages]

  const onDrop = info => {
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      loop(data, dropKey, item => {
        item.children = [...item.children]
        item.children.unshift(dragObj)
      });
    } else if (
      (info.node.props.children || []).length > 0 &&
      info.node.props.expanded &&
      dropPosition === 1
    ) {
      loop(data, dropKey, item => {
        item.children = [...item.children];
        item.children.unshift(dragObj);
      });
    } else {
      let ar, i;
      loop(data, dropKey, (_, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    dispatch(setLight(true))
    ApiPage.updateNested(getUpdateNestedParams(data)).then(_ => loadData())
  }

  const onTreeSelect = useCallback((selectedKeys, e) => {
    if (e.node.children && e.node.children.length) {
      //do nothing
    } else if (selectedKeys.length) {
      const { vir, web } = getSplitParams(routerState)
      if (Object.keys(vir).length) {
        history.push(getRouterPath(web))
      }
      const doNext = () => {
        const nextPage = {
          ...e.node,
          title: void 0,
          selectedKeys
        }
        setSelectPageAndReplacePath(dispatch, nextPage)
        dispatch(setPageInfo(nextPage))
      }
      if (shouldSave) {
        dispatch(confirmUpdatePage(selectPage.pageId)).then(_ => doNext())
      } else {
        doNext()
      }
    }
  }, [dispatch, selectPage, routerState, shouldSave])

  const pageForm = (formData) => {
    return <div style={{ maxHeight: 600, overflowY: 'auto', paddingRight: 8 }}>
      <Form
        data={formData}
        config={{ labelCol: { span: formData.pageId ? 4 : 2 } }}
        onSubmit={data => {
          Dialog.loading('pageDialog')
          if (!data.pageId) {
            dispatch(setLight(true))
          }
          if (data.pageState === 2) {
            delete data.masterplatePageId
          }
          ApiPage.insertOrUpdate({ projectId, ...data }).then(_ => {
            Dialog.close('pageDialog')
            if (data.masterplatePageId) {
              defaultParams.masterplatePageId = data.masterplatePageId
            }
            loadData(formData)
          })
        }}
        columns={[
          { type: 'radios-button', label: '页面类型', prop: 'pageState', value: 1, options: { 1: '母版页面', 2: '空白页面' }, config: { buttonStyle: "solid", help: '母版页面：需要选择母版，创建后自带母版功能，空白页面：空空如也' }, load: ({ data }) => !data.pageId },
          { type: 'input', label: '页面名称', prop: 'pageName', placeholder: '请输入页面名称，如：订单管理', rule: 'must,name,notstartwithnumber', config: inputConfig },
          { type: 'input', label: '文件名称', prop: 'pageFileName', placeholder: 'fileName, 缺省为页面名称拼音，如：orderManage', rule: 'empty,name', config: inputConfig },
          { type: 'input', label: '路由路径', prop: 'pageRouter', placeholder: '缺省为: [父级文件名称]/文件名称, 会自动添加父级前置路由, 如：user', rule: 'empty,name', config: inputConfig },
          masterplatePageId,
          [
            {

              type: 'upload',
              prop: 'tableInfos',
              config: {
                showUploadList: false,
                action: '/lightApi/Page/parseGenerateFile',
                filesize: 0.5,
                headers: {
                  'token': user.getToken()
                },
                onSuccess(res) {
                  if (res.data) {
                    return res.data
                  }
                  return null
                },
                onError: (rsp) => {
                  message.error(rsp.message)
                }
              }
            },
            { type: 'text', filter: ({ data }) => data.tableInfos ? "文件解析成功！" : "", style: { marginLeft: 12, color: "#5cb87a" } },
            {
              type: 'formitem', label: '自动生成', config: {
                help: <>解析文件自动生成对应组件与其属性到页面母版中，支持 <Button size="small" type="link" onClick={() => {
                  Dialog.open(DocDialogName, "文件使用提示").then(s => {
                    s(<div className='dialog-content'>
                      <div>.sql 文件，是导出的创建表结构语句，如：</div>
                      {renderCode({ value: sqlStr })}
                      <div>.java 文件，读取 private 开头的字段，以及其上一行的注释，如：</div>
                      {renderCode({ value: javaStr })}
                      <div>文本文件，描述信息（标签名 字段名 [类型，非必要，缺省string：string/number/date]），如：</div>
                      {renderCode({ value: txtStr })}
                    </div>)
                  })
                }}>.sql, .java, 或文本</Button>UTF8编码格式文件</>
              }, load: ({ data }) => !data.pageId && data.pageState !== 2
            }
          ],
          { type: 'radios-button', label: '在菜单中', prop: 'pageHidden', options: { 1: '显示', 2: '隐藏' }, config: { buttonStyle: "solid", help: '隐藏表示：路由可以访问，但是在菜单中不显示' } },
          // [
          //   { type: 'switch', prop: 'curd', disabled: ({ data }) => !data.connect },
          //   { type: 'text', value: '数据库连接失败', load: ({ data }) => !data.connect, style: { marginLeft: 8, color: '#545454' } },
          //   { type: 'text@tip', value: '打开后可以生成基本增删改查, 以及对应接口访问' },
          //   { type: 'formitem', label: '自动生成', load: ({ data }) => !data.pageId && data.pageState !== 2 }
          // ],
          // [
          //   { type: 'input@w680', label: 'filter', prop: 'filter' },
          //   {
          //     type: 'select-multiple@w680', label: '相关数据表', prop: 'connectTables', options({ resolve }) {
          //       ApiPage.tableNames({ projectId }).then(res => {
          //         resolve(res.toString())
          //       })
          //     }
          //   },
          //   {
          //     prop: 'tableInfos', label: '生成规则', render({ value = [] }) {
          //       return <Table
          //         data={value}
          //         pagination={false}
          //         columns={[
          //           { prop: 'columnComment', label: '标签名' },
          //           { prop: 'columnNameWithCamelCase', label: '属性名' },
          //           { prop: 'useElementType', type: 'select@w160', width: 165, label: '使用组件' },
          //           { prop: 'inSearch', type: 'switch@small', label: '查询' },
          //           { prop: 'inForm', type: 'switch@small', label: '表单' },
          //           { prop: 'inTable', type: 'switch@small', label: '表格' },
          //           { prop: 'rule', type: 'select-multiple@w160', width: 165, label: '验证', options: "must,int" },
          //         ]}
          //       />
          //     }
          //   },
          //   { type: 'div', load: ({ data }) => data.curd }
          // ]
        ]}
      />
    </div>
  }
  return (
    <div className={styles["page-body"]}>
      <Spin spinning={loading || light}>
        {
          !simple && <>
            <Dialog name="pageDialog" title="新建页面" config={{ destroyOnClose: true, maskClosable: false }} />
            <div className={styles["page-body-header"]} >
              <Button
                type="text"
                size="small"
                className={styles["page-body-header-pn"]}
                title={"预览 " + projectName + '项目'}
                onClick={_ => {
                  const toPreview = () => {
                    const path = window.location.href.split('#')[0]
                    window.open(path + `#/preview?projectId=${projectId}&mpId=${masterplateProject?.masterplateProjectId}`, '_blank')
                  }

                  if (shouldSave) {
                    Modal.confirm({
                      title: '当前有数据修改未保存，不会在预览中生效，确定预览？',
                      onOk: toPreview
                    })
                  } else {
                    toPreview()
                  }
                }}
              >
                {getSubString(projectName || '...', 14)} <EyeOutlined />
              </Button>
              <div style={{ flex: 1 }}></div>
              <Button size="small"
                icon={<PlusOutlined />}
                style={{ marginRight: 5 }}
                shape="round"
                type='dashed'
                disabled={!hasPermission}
                onClick={_ => {
                  if (shouldSave) {
                    message.error('请先保存当前更改页面！')
                  } else {
                    Dialog.open('pageDialog', { title: '新建页面', width: 1180 })
                      .then(appendNewPage)
                  }
                }}
              >
                新建页面
              </Button>
            </div>
            <Divider style={{ marginTop: 10, marginBottom: 18 }} />
          </>
        }
        {
          !iKnow && hasPermission && <Alert message="拖拽页面名称可以编排菜单结构" closable onClose={confirm} style={{ marginBottom: 12 }} />
        }
        <div className={classNames(styles["page-login"], {
          [styles['page-login-selected']]: selectPage.selectedKeys.includes(loginPage?.pageId)
        })} onClick={_ => {
          loginPage && onTreeSelect([loginPage.pageId], { node: loginPage })
        }}>
          {loginPage?.pageName}
        </div>
        <div className={styles["page-drag"]}>
          {waitLoadOnce && <Tree
            blockNode
            onDrop={onDrop}
            treeData={usePages}
            className={styles["draggable-tree"]}
            draggable={hasPermission && !simple}
            selectedKeys={selectPage.selectedKeys}
            defaultExpandedKeys={defaultExpandedKeys}
            onSelect={onTreeSelect}
          />}
        </div>
      </Spin>
    </div>
  )
}