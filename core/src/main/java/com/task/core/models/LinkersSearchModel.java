package com.task.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;

import javax.inject.Inject;

/**
 * LInks Search Component Model
 */
@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class LinkersSearchModel {

    @Inject
    private int countPaginationRows;

    @Inject
    private String foundMessage;

    @Inject
    private String errorMessageHexColor;

    @Inject
    private String backgroundHexColor;

    @Inject
    private String pathToResource;

    @Inject
    private String notFoundMessage;

    @Inject
    private String urlIsNotValidMessage;

    @Inject
    private String requestErrorMessage;

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

    public String getPathToResource() {
        return pathToResource;
    }

    public String getNotFoundMessage() {
        return notFoundMessage;
    }

    public String getUrlIsNotValidMessage() {
        return urlIsNotValidMessage;
    }

    public String getRequestErrorMessage() {
        return requestErrorMessage;
    }
}
