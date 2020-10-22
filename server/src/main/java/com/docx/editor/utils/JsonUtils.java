//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.docx.editor.utils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

public final class JsonUtils {
    private static final String DEFAULT_DATE_PATTERN = "yyyy-MM-dd";

    private JsonUtils() {
    }

    public static String getJson(Object object, ObjectMapper mapper) {
        try {
            String json = mapper.writeValueAsString(object);
            return json;
        } catch (JsonProcessingException var3) {
            throw new RuntimeException(var3);
        }
    }

    public static String getJson(Object object) {
        ObjectMapper mapper = buildObjectMapper();
        String json = getJson(object, mapper);
        return json;
    }

    public static <T> T getObject(String json, Class<T> clazz) {
        ObjectMapper mapper = buildObjectMapper();

        try {
            T t = mapper.readValue(json, clazz);
            return t;
        } catch (IOException var4) {
            throw new RuntimeException(var4);
        }
    }

    public static Map<String, ?> getMap(String json) {
        ObjectMapper mapper = buildObjectMapper();

        try {
            Map<String, ?> t = (Map)mapper.readValue(json, Map.class);
            return t;
        } catch (IOException var3) {
            throw new RuntimeException(var3);
        }
    }

    public static <T> List<T> getList(String json, Class<T> clazz) {
        ObjectMapper mapper = buildObjectMapper();

        try {
            JavaType javaType = mapper.getTypeFactory().constructParametricType(ArrayList.class, new Class[]{clazz});
            List<T> list = (List)mapper.readValue(json, javaType);
            return list;
        } catch (IOException var5) {
            throw new RuntimeException(var5);
        }
    }

    public static JsonNode readTree(String json) {
        ObjectMapper mapper = buildObjectMapper();

        try {
            JsonNode node = mapper.readTree(json);
            return node;
        } catch (IOException var3) {
            throw new RuntimeException(var3);
        }
    }

    public static ObjectMapper buildObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.setTimeZone(TimeZone.getDefault());
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(Long.class, NumberAsStringSerializer.instance);
        simpleModule.addSerializer(Long.TYPE, NumberAsStringSerializer.instance);
        simpleModule.addSerializer(Double.class, NumberAsStringSerializer.instance);
        simpleModule.addSerializer(Double.TYPE, NumberAsStringSerializer.instance);
        simpleModule.addSerializer(BigDecimal.class, NumberAsStringSerializer.instance);
        mapper.registerModule(simpleModule);
        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd"));
        return mapper;
    }
}
