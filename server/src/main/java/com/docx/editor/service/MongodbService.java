package com.docx.editor.service;

import com.mongodb.client.MongoDatabase;
import com.mongodb.client.gridfs.GridFSBucket;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.GridFSDownloadStream;
import com.mongodb.client.gridfs.model.GridFSFile;
import com.mongodb.gridfs.GridFSDBFile;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsOperations;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.InputStream;


@Service
public class MongodbService {
    @Autowired
    private GridFsOperations fs;
    @Resource
    private MongoDbFactory mongoDbFactory;
    public String store(InputStream inputStream,String fileName){
        ObjectId objectId = fs.store(inputStream,fileName);
        return objectId.toHexString();
    }

    public InputStream fetch(String id) throws Exception{
        GridFSFile f = findById(id);
        GridFsResource resource = convertGridFSFile2Resource(f);
        System.out.println(resource);
        return resource.getInputStream();
    }

    private GridFSFile findById(String id) {
        return fs.findOne(buildQueryById(id));
    }

    private Query buildQueryById(String id) {
        return new Query(Criteria.where("_id").is(id));
    }

    public GridFsResource convertGridFSFile2Resource(GridFSFile gridFsFile) {
        GridFSDownloadStream gridFSDownloadStream = gridFSBucket.openDownloadStream(gridFsFile.getObjectId());
        return new GridFsResource(gridFsFile, gridFSDownloadStream);
    }



    @Bean
    public GridFSBucket getGridFSBuckets() {
        MongoDatabase db = mongoDbFactory.getDb();
        return GridFSBuckets.create(db);
    }

    @Resource
    private GridFSBucket gridFSBucket;

}
