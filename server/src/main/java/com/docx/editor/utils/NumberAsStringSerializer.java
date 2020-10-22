//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.docx.editor.utils;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;

public class NumberAsStringSerializer extends JsonSerializer<Number> {
    private static long JACASCRIPT_LONG_MAX = (long)Math.pow(2.0D, 52.0D);
    public static final NumberAsStringSerializer instance = new NumberAsStringSerializer();

    public NumberAsStringSerializer() {
    }

    public void serialize(Number value, JsonGenerator jgen, SerializerProvider serializers) throws IOException {
        if (value.longValue() > JACASCRIPT_LONG_MAX) {
            jgen.writeString(value.toString());
        } else {
            jgen.writeNumber(value.toString());
        }

    }
}
