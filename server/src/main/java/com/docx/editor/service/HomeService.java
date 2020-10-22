package com.docx.editor.service;

import com.docx.editor.dao.CloudFileMapper;
import com.docx.editor.dto.CloudFile;
import com.docx.editor.dto.CloudFileExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HomeService {

    @Autowired
    CloudFileMapper cloudFileMapper;

    public void insert(CloudFile file){
        cloudFileMapper.insert(file);
    }

    public CloudFile getFile(String id){
        return cloudFileMapper.selectByPrimaryKey(id);
    }

    public List<CloudFile> getFiles(){
        return cloudFileMapper.selectByExample(new CloudFileExample());
    }
}
