package com.task.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

@Model(adaptables = Resource.class)
public class LinkersSearchModelImpl {

    @Inject
    private int countPaginationRows;

    @Inject
    private String foundMessage;

    @Inject
    private String errorMessageHexColor;

    @Inject
    private String backgroundHexColor;

    @Inject
    private String buttonBackgroundHexColor;

    @Inject
    private String buttonTextHexColor;

    @Inject
    private String buttonUnavailableBackgroundHexColor;

    @Inject
    private String buttonUnavailableTextHexColor;

    @PostConstruct
    protected void init() {

    }

    public int getCountPaginationRows() {
        return countPaginationRows;
    }

    public String getFoundMessage() {
        return foundMessage;
    }

    public String getErrorMessageHexColor() {
        return errorMessageHexColor;
    }

    public String getBackgroundHexColor() {
        return backgroundHexColor;
    }

    public String getButtonBackgroundHexColor() {
        return buttonBackgroundHexColor;
    }

    public String getButtonTextHexColor() {
        return buttonTextHexColor;
    }

    public String getButtonUnavailableBackgroundHexColor() {
        return buttonUnavailableBackgroundHexColor;
    }

    public String getButtonUnavailableTextHexColor() {
        return buttonUnavailableTextHexColor;
    }
}
