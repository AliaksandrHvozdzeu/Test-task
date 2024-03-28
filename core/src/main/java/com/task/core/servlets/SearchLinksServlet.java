package com.task.core.servlets;

import com.day.cq.commons.Externalizer;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.task.core.beans.Response;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

import javax.jcr.*;
import javax.servlet.Servlet;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

/**
 * Servlet for searching links by path
 */
@Component(
        immediate = true,
        service = {Servlet.class},
        property = {Constants.SERVICE_DESCRIPTION + "=Search Links Servlet", "sling.servlet.methods=" +
                HttpConstants.METHOD_GET, "sling.servlet.paths=" + "/bin/searchlinks"}
)
public class SearchLinksServlet extends SlingSafeMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final String PATH_SEPARATOR = "/";
    private static final String PATH_REQUEST_PARAM = "path";
    private static final String LINK_REQUEST_PARAM = "link";
    private static final String HTML_EXTENSION_FORMAT = "%s.html";
    private static final String APPLICATION_JSON_FORMAT_RESPONSE = "application/json";
    private static final String JCR_CONTENT_PATH_PART = PATH_SEPARATOR + "_jcr_content";

    @Reference
    private Externalizer externalizer;

    @Override
    protected void doGet(final SlingHttpServletRequest request, final SlingHttpServletResponse response) throws IOException {
        String contentPath = request.getParameter(PATH_REQUEST_PARAM);
        String linkToFind = request.getParameter(LINK_REQUEST_PARAM);
        if (StringUtils.isBlank(contentPath) || StringUtils.isBlank(linkToFind)) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Content path or link parameter is missing");
            return;
        }

        try {
            List<String> nodesWithLink = findNodesWithLink(contentPath, linkToFind, request.getResourceResolver());
            List<Response> responseList = new ArrayList<>();

            IntStream.range(0, nodesWithLink.size()).forEach(i -> {
                Response resp = new Response();
                resp.setPath(nodesWithLink.get(i));
                resp.setLink(getPageUrlByPath(request.getResourceResolver(), nodesWithLink.get(i)));
                responseList.add(resp);
            });

            Type listType = new TypeToken<List<Response>>() {
            }.getType();
            Gson gson = new Gson();
            String json = gson.toJson(responseList, listType);
            response.setContentType(APPLICATION_JSON_FORMAT_RESPONSE);
            response.getWriter().write(json);

        } catch (Exception e) {
            response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error occurred: " + e.getMessage());
        }
    }

    /**
     * The method for getting list with paths
     * @param path String
     * @param linkToFind String
     * @param resolver ResourceResolver
     * @return List<String> with paths
     * @throws RepositoryException
     */
    private List<String> findNodesWithLink(String path, String linkToFind, ResourceResolver resolver) throws RepositoryException {
        List<String> nodesWithLink = new ArrayList<>();
        Session session = resolver.adaptTo(Session.class);
        if (session != null) {
            Node rootNode = session.getNode(path);
            findNodesWithLinkRecursive(rootNode, linkToFind, nodesWithLink);
        }
        return nodesWithLink;
    }

    /**
     * The method for getting page URL by path
     * @param resolver ResourceResolver
     * @param path String
     * @return String URL
     */
    private String getPageUrlByPath(ResourceResolver resolver, String path) {
        String externalizedURL = null;
        if (externalizer != null && resolver != null) {
            externalizedURL = externalizer.externalLink(resolver, Externalizer.LOCAL, path);
            externalizedURL = externalizedURL.substring(0, externalizedURL.indexOf(JCR_CONTENT_PATH_PART));
            externalizedURL = String.format(HTML_EXTENSION_FORMAT, externalizedURL);
        }
        return externalizedURL;
    }

    /**
     * The method for building list with founded paths
     * @param node Node
     * @param linkToFind String
     * @param nodesWithLink List<String>
     * @throws RepositoryException
     */
    private void findNodesWithLinkRecursive(Node node, String linkToFind, List<String> nodesWithLink) throws RepositoryException {
        PropertyIterator properties = node.getProperties();
        while (properties.hasNext()) {
            Property property = properties.nextProperty();
            if (!property.isMultiple()) {
                if (property.getType() == PropertyType.STRING) {
                    String stringValue = String.valueOf(property.getValue());
                    if (StringUtils.contains(stringValue, linkToFind)) {
                        nodesWithLink.add(node.getPath());
                    }
                }
            }
        }

        NodeIterator childNodes = node.getNodes();
        while (childNodes.hasNext()) {
            Node childNode = childNodes.nextNode();
            findNodesWithLinkRecursive(childNode, linkToFind, nodesWithLink);
        }
    }
}
