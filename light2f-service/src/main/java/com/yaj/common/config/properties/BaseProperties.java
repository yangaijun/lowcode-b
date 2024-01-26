package com.yaj.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "base")
public class BaseProperties {

    public String test;
    public List<String> noAuthPath = new ArrayList<>();

    public String getTest() {
        return test;
    }

    public void setTest(String test) {
        this.test = test;
    }

    public List<String> getNoAuthPath() {
        return noAuthPath;
    }

    public void setNoAuthPath(List<String> noAuthPath) {
        this.noAuthPath = noAuthPath;
    }
 
}
