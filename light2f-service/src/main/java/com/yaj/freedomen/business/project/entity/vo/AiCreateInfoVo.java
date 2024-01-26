package com.yaj.freedomen.business.project.entity.vo;

import com.yaj.common.generate.TableInfo;
import com.yaj.freedomen.business.masterplateproject.entity.po.MasterplateProjectPO;

import java.util.List;

public class AiCreateInfoVo {
    private MasterplateProjectPO masterplateProject;
    private Integer masterplatePageId;
    private Integer pageId;

    public  static  class GenInfo {
        private String fileName;
        private String pageName;
        private List<String> tables;

        private List<TableInfo> insertOrUpdate;
        private List<TableInfo> search;
        private List<TableInfo> show;

        public String getFileName() {
            return fileName;
        }

        public void setFileName(String fileName) {
            this.fileName = fileName;
        }

        public String getPageName() {
            return pageName;
        }

        public void setPageName(String pageName) {
            this.pageName = pageName;
        }

        public List<String> getTables() {
            return tables;
        }

        public void setTables(List<String> tables) {
            this.tables = tables;
        }

        public List<TableInfo> getInsertOrUpdate() {
            return insertOrUpdate;
        }

        public void setInsertOrUpdate(List<TableInfo> insertOrUpdate) {
            this.insertOrUpdate = insertOrUpdate;
        }

        public List<TableInfo> getSearch() {
            return search;
        }

        public void setSearch(List<TableInfo> search) {
            this.search = search;
        }

        public List<TableInfo> getShow() {
            return show;
        }

        public void setShow(List<TableInfo> show) {
            this.show = show;
        }
    }

    private List<GenInfo> genInfoList;

    public MasterplateProjectPO getMasterplateProject() {
        return masterplateProject;
    }

    public void setMasterplateProject(MasterplateProjectPO masterplateProject) {
        this.masterplateProject = masterplateProject;
    }

    public Integer getMasterplatePageId() {
        return masterplatePageId;
    }

    public void setMasterplatePageId(Integer masterplatePageId) {
        this.masterplatePageId = masterplatePageId;
    }

    public Integer getPageId() {
        return pageId;
    }

    public void setPageId(Integer pageId) {
        this.pageId = pageId;
    }

    public List<GenInfo> getGenInfoList() {
        return genInfoList;
    }

    public void setGenInfoList(List<GenInfo> genInfoList) {
        this.genInfoList = genInfoList;
    }
}
