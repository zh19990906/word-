package com.docx.editor.utils;

import org.docx4j.Docx4J;
import org.docx4j.Docx4jProperties;
import org.docx4j.convert.out.ConversionFeatures;
import org.docx4j.convert.out.HTMLSettings;
import org.docx4j.convert.out.html.SdtToListSdtTagHandler;
import org.docx4j.convert.out.html.SdtWriter;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.json.JSONArray;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.*;
import org.jsoup.select.Elements;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

public class DocxConvertor {
    static {

        nestLists = true;
        inputFilePath = "E:\\test\\document.docx";
        outFilePath = "E:\\test\\document.docx.html";
    }


    static boolean nestLists;
    static String inputFilePath;
    static String outFilePath;


    public static JSONObject convert(MultipartFile file) throws Exception{

        File docxFile = new File(inputFilePath);
        docxFile.getParentFile().mkdirs();
        if(!docxFile.exists())
            docxFile.createNewFile();

        file.transferTo(docxFile);
        WordprocessingMLPackage wordMLPackage;

        wordMLPackage = Docx4J.load(docxFile);


        // HTML exporter setup (required)
        HTMLSettings htmlSettings = Docx4J.createHTMLSettings();
        long nowTime = new Date().getTime();

        htmlSettings.setImageDirPath(inputFilePath+nowTime+"_files");
        htmlSettings.setImageTargetUri(docxFile.getName()+nowTime+"_files");
        htmlSettings.setWmlPackage(wordMLPackage);



        String userCSS = null;
        if (nestLists) {
            // use browser defaults for ol, ul, li
            userCSS = "html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, img,  table, caption, tbody, tfoot, thead, tr, th, td " +
                    "{ margin: 0; padding: 0; border: 0;}" +
                    "body {line-height: 1;} ";
        } else {
            userCSS = "html, body, div, span, h1, h2, h3, h4, h5, h6, p, a, img,  ol, ul, li, table, caption, tbody, tfoot, thead, tr, th, td " +
                    "{ margin: 0; padding: 0; border: 0;}" +
                    "body {line-height: 1;} ";

        }
        htmlSettings.setUserCSS(userCSS);



        // list numbering:  depending on whether you want list numbering hardcoded, or done using <li>.
        if (nestLists) {
            SdtWriter.registerTagHandler("HTML_ELEMENT", new SdtToListSdtTagHandler());
        } else {
            htmlSettings.getFeatures().remove(ConversionFeatures.PP_HTML_COLLECT_LISTS);
        }

        // output to an OutputStream.
        OutputStream os;

        os = new FileOutputStream(outFilePath);


        // If you want XHTML output
        Docx4jProperties.setProperty("docx4j.Convert.Out.HTML.OutputMethodXML", true);

        Docx4J.toHTML(htmlSettings, os, Docx4J.FLAG_EXPORT_PREFER_XSL);

        if (wordMLPackage.getMainDocumentPart().getFontTablePart()!=null) {
            wordMLPackage.getMainDocumentPart().getFontTablePart().deleteEmbeddedFontTempFiles();
        }

        htmlSettings = null;
        wordMLPackage = null;
        os.flush();
        os.close();
        return parseHtml();
    }
    //outputStream转inputStream
    private static ByteArrayInputStream parse(OutputStream out) throws Exception
    {

        ByteArrayOutputStream   baos=new   ByteArrayOutputStream();
        baos=(ByteArrayOutputStream) out;
        ByteArrayInputStream swapStream = new ByteArrayInputStream(baos.toByteArray());
        return swapStream;
    }

    private static JSONObject parseHtml()throws Exception{
        Document document = Jsoup.parse(new File(outFilePath),"utf8");
        Element element = document.head();
        List<Element> headers = element.getAllElements();
        Elements cssStyle = element.getElementsByTag("style");
        StringBuilder stringBuilder = new StringBuilder();
        try {
            if (cssStyle.size() > 0) {

                for (Element node : cssStyle) {
                    String data = node.data();
                    stringBuilder.append(data);
                    stringBuilder.append("\n");
                }
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        Elements body = document.getElementsByClass("document");
        //List<Node> nodes = body.first().childNodes();
        JSONObject object = new JSONObject();
        JSONObject jdocument = new JSONObject();
        object.put("document",jdocument);

        parseNode(body.first(),jdocument);
        JSONObject result = new JSONObject();
        result.put("docx",object);
        result.put("css",stringBuilder.toString());
        return result;

    }

    private static void setNodeParams(Node node, JSONObject object){
        String name = node.nodeName().trim().toLowerCase();
        String[] blocks = {"div","p","table","colgroup","col","tr","td","thead","th","tfoot","tbody","ul","ol","li"};

        if(Arrays.asList(blocks).contains(name)){
            object.put("object","block");
            object.put("type",name);
            if(name.equals("col")){
                object.put("isVoid",false);
            }
        }else if (node instanceof TextNode){
            object.put("object","text");
            object.put("type",name);
        }
        else{
            object.put("object","inline");
            object.put("type",name);
            if(name.equals("img")){
                object.put("isVoid",true);
            }
        }
    }

    private static void parseNode(Node node, JSONObject object){
        //object.put("tag",node.nodeName());
        // object.put("object",)
        setNodeParams(node,object);
        if(node instanceof TextNode){

            object.put("text",((TextNode)node).text());
            return;

        }else if(node instanceof Comment){
            return;
        }

        Attributes attributes = node.attributes();
        JSONObject data = new JSONObject();
        object.put("data",data);
        for (Attribute attribute : attributes.asList()){
            data.put(attribute.getKey(),attribute.getValue());
        }

        //System.out.println(node.attributes());
        if(node.childNodeSize()<1)
            return;
        List<Node> nodes = node.childNodes();
        JSONArray jsonArray = new JSONArray();

        for (Node child : nodes){
            if(child instanceof Comment)
                continue;
            if(child instanceof TextNode){
                if(((TextNode)child).text().trim().equals("")){
                    continue;
                }
            }


            JSONObject obj = new JSONObject();
            parseNode(child,obj);
            jsonArray.put(obj);


        }
        if(jsonArray.length()>0) {
            String objectType = object.getString("object");
            object.put(objectType.equals("block")||objectType.equals("inline")?"nodes":"leaves", jsonArray);
        }
    }
}
