package com.yaj.freedomen.business.page.entity.vo;

import com.yaj.freedomen.business.initcode.entity.po.InitCodePO;
import com.yaj.freedomen.business.masterplatepage.entity.po.MasterplatePagePO;
import com.yaj.freedomen.business.page.entity.po.PagePO;
import com.yaj.freedomen.business.service.entity.po.ServicePO;

public class TempInfo {
    MasterplatePagePO masterplatePage;
    PagePO page;
    ServicePO service;
    InitCodePO initCode;

    public MasterplatePagePO getMasterplatePage() {
        return masterplatePage;
    }

    public void setMasterplatePage(MasterplatePagePO masterplatePage) {
        this.masterplatePage = masterplatePage;
    }

    public PagePO getPage() {
        return page;
    }

    public void setPage(PagePO page) {
        this.page = page;
    }

    public ServicePO getService() {
        return service;
    }

    public void setService(ServicePO service) {
        this.service = service;
    }

    public InitCodePO getInitCode() {
        return initCode;
    }

    public void setInitCode(InitCodePO initCode) {
        this.initCode = initCode;
    }
}
