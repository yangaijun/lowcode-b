package com.yaj.core.beetl;

import org.beetl.ext.spring.BeetlGroupUtilConfiguration;

import com.yaj.core.util.ToolUtil;

public class BeetlConfiguration extends BeetlGroupUtilConfiguration {

    @Override
    public void initOther() {

        groupTemplate.registerFunctionPackage("tool", new ToolUtil());

    }

}
