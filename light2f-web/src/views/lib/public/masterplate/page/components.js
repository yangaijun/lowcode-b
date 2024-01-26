import { Dialog, Form } from 'freedomen';
import { masterplateProject } from 'components/columns';
import { DesignType } from 'views/light/types';
import history from 'libs/history';
import { getRouterPath } from 'libs/utils';
import { DocDialogName } from 'views/light/config';

export function openDialog(page) {
    Dialog.open('masterplatePage', { title: '选择项目母版以配合使用全局样式', okText: '进入结构设计' }).then(set => set(
        <Form
            columns={[masterplateProject]}
            onSubmit={data => {
                history.push(getRouterPath(
                    {
                        pageId: page.pageId,
                        designType: DesignType.MASTERPLATE,
                        pn: page.masterplatePageName,
                        masterplatePageId: page.masterplatePageId,
                        mpId: data.masterplateProject?.masterplateProjectId
                    },
                    { pathname: '/light/design' }
                ))
                page.masterplatePageDes && Dialog.open(DocDialogName, '页面母版详细介绍').then(set => {
                    set(page.masterplatePageDes)
                })
            }}
        />
    ))
}