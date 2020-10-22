package com.docx.editor.dao;

import com.docx.editor.dto.CloudFile;
import com.docx.editor.dto.CloudFileExample;
import java.util.List;
import org.apache.ibatis.annotations.Param;

public interface CloudFileMapper {
    long countByExample(CloudFileExample example);

    int deleteByExample(CloudFileExample example);

    int deleteByPrimaryKey(String id);

    int insert(CloudFile record);

    int insertSelective(CloudFile record);

    List<CloudFile> selectByExample(CloudFileExample example);

    CloudFile selectByPrimaryKey(String id);

    int updateByExampleSelective(@Param("record") CloudFile record, @Param("example") CloudFileExample example);

    int updateByExample(@Param("record") CloudFile record, @Param("example") CloudFileExample example);

    int updateByPrimaryKeySelective(CloudFile record);

    int updateByPrimaryKey(CloudFile record);
}