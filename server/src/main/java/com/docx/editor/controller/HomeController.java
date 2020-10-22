package com.docx.editor.controller;

import com.docx.editor.dto.CloudFile;
import com.docx.editor.service.HomeService;
import com.docx.editor.service.MongodbService;
import com.docx.editor.utils.DocxConvertor;
import com.docx.editor.utils.JsonUtils;
import com.docx.editor.utils.RandomIds;
import com.docx.editor.utils.ServiceResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;


@RestController
public class HomeController {

    @Autowired
    MongodbService mongodbService;
    @Autowired
    HomeService homeService;

    @PostMapping(value = "upload")
    public String upload(@RequestParam(value = "file")MultipartFile file){
        ServiceResult<CloudFile> result = new ServiceResult<>();
        result.setSucceed(false);
        try {
            CloudFile cloudFile = new CloudFile();
            cloudFile.setCreateTime(new Date());
            cloudFile.setFileName(file.getOriginalFilename());
            String fileId = mongodbService.store(file.getInputStream(), file.getOriginalFilename());
            cloudFile.setFileId(fileId);
            org.json.JSONObject jsonObject = DocxConvertor.convert(file);
            storeDocxJson(cloudFile,jsonObject);
            cloudFile.setId(RandomIds.uuid());
            homeService.insert(cloudFile);
            result.setSucceed(true);
            result.setData(cloudFile);
        }catch (Exception e){
            e.printStackTrace();
        }
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        return JsonUtils.getJson(result,objectMapper);
    }

    private void storeDocxJson(CloudFile file,org.json.JSONObject jsonObject){
        if(!jsonObject.isNull("docx")){
            InputStream is = new ByteArrayInputStream(jsonObject.getJSONObject("docx").toString().getBytes());
            String docxFile = mongodbService.store(is,file.getFileId()+".json");
            file.setJsonId(docxFile);

        }
        if(!jsonObject.isNull("css")){
            InputStream is = new ByteArrayInputStream(jsonObject.getString("css").getBytes());
            String cssFile = mongodbService.store(is,file.getFileId()+".css");
            file.setCssId(cssFile);

        }

    }

    @RequestMapping(value = "/getFile", method = { RequestMethod.GET,
            RequestMethod.POST })
    public ResponseEntity<CloudFile> getFile(HttpServletRequest request,
                                             String id){
        CloudFile fileInfo=homeService.getFile(id);
        return ResponseEntity.ok(fileInfo);
    }

    @GetMapping(value="download/{id}")
    public void download(@PathVariable("id")String id,
                         HttpServletResponse response,
                         @RequestHeader(value="User-Agent", defaultValue="Firefox") String ua,
                         @RequestParam(name="asAttachment", required=false, defaultValue="false")boolean asAttachment)
            throws Exception {
        InputStream stream = mongodbService.fetch(id);
        IOUtils.copy(stream, response.getOutputStream());
        stream.close();
    }

    @RequestMapping(value = "/getFiles", method = { RequestMethod.GET,
            RequestMethod.POST })
    public String getFiles(HttpServletRequest request,
                                                   String id){
        ServiceResult<List> result = new ServiceResult<>();
        List fileInfos=homeService.getFiles();
        result.setSucceed(true);
        result.setData(fileInfos);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
        return JsonUtils.getJson(result,objectMapper);
    }
}
