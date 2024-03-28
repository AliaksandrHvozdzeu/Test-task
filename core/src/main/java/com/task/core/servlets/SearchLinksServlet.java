package com.task.core.servlets;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.json.JSONArray;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;

import javax.jcr.*;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

@Component(immediate = true, service = {Servlet.class}, property = {Constants.SERVICE_DESCRIPTION + "=Search Links Servlet", "sling.servlet.methods=" + HttpConstants.METHOD_GET, "sling.servlet.paths=" + "/bin/searchlinks"})
public class SearchLinksServlet extends SlingSafeMethodsServlet {

    private static final long serialVersionUID = 1L;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        String contentPath = request.getParameter("path");
        String linkToFind = request.getParameter("link");
        if (StringUtils.isBlank(contentPath) || StringUtils.isBlank(linkToFind)) {
            response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Content path or link parameter is missing");
            return;
        }

        try {
            List<String> nodesWithLink = findNodesWithLink(contentPath, linkToFind, request.getResourceResolver());
            List<String> pathList = new ArrayList<>(nodesWithLink);
            Type listType = new TypeToken<List<String>>() {}.getType();
            Gson gson = new Gson();
            String json = gson.toJson(pathList, listType);
            response.setContentType("application/json");
            response.getWriter().write(json);
        } catch (Exception e) {
            response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error occurred: " + e.getMessage());
        }
    }

    private List<String> findNodesWithLink(String path, String linkToFind, ResourceResolver resolver) throws RepositoryException {
        List<String> nodesWithLink = new ArrayList<>();
        Session session = resolver.adaptTo(Session.class);
        if (session != null) {
            Node rootNode = session.getNode(path);
            findNodesWithLinkRecursive(rootNode, linkToFind, nodesWithLink);
        }
        return nodesWithLink;
    }

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

        // Recursively traverse child nodes
        NodeIterator childNodes = node.getNodes();
        while (childNodes.hasNext()) {
            Node childNode = childNodes.nextNode();
            findNodesWithLinkRecursive(childNode, linkToFind, nodesWithLink);
        }
    }
}
