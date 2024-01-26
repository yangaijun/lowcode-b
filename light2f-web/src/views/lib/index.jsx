import { Tabs } from "antd";
import classnames from 'classnames'
import PublicProject from "./public/project";
import styles from './index.module.less'
import { ProjectPlate, PagePlate } from "./public/masterplate";
import { libTabKey } from "components/columns";
import Plug from "./public/plug";
import { canDoNext, parseURLParams, replaceOrAddQuery } from "libs/utils";
import { useCallback, useMemo } from "react";

const shouldLoginKeys = [libTabKey.pageMp, libTabKey.projectMp]

export default function Lib({ location, history }) {
    const routerState = parseURLParams();

    const {
        w,
        plugType,
        type = libTabKey.comp,
        projectId,
        pageNo,
        pageSize
    } = routerState

    const redirect = useCallback((params) => {
        history.replace(replaceOrAddQuery(params))
    }, [])

    const plateProps = {
        w,
        onChange(w) {
            redirect({ w })
        }
    }

    const items = [
        // {
        //     key: libTabKey.project,
        //     label: `公共项目`,
        //     children: <PublicProject />,
        // },
        {
            key: libTabKey.comp,
            label: `公共组件`,
            children: <Plug projectId={projectId} pageNo={pageNo} pt={plugType} pageSize={pageSize} onPage={(pageNo, pageSize) => {
                redirect({ pageNo, pageSize })
            }} />,
        },
        {
            key: libTabKey.projectMp,
            label: `项目母版`,
            children: <ProjectPlate {...plateProps} />,
        },
        {
            key: libTabKey.pageMp,
            label: `页面母版`,
            children: <PagePlate {...plateProps} />,
        },
    ]

    return <div className={classnames(styles.main)}>
        <Tabs activeKey={type} items={items} onChange={value => {
            const nextPath = '/lib?type=' + value
            if (shouldLoginKeys.includes(value) && !canDoNext("请先登录后查看", nextPath)) {
                return
            }

            if (value !== type) {
                history.replace(nextPath)
            }
        }} />
    </div>
}