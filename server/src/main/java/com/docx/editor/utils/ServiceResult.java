//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.docx.editor.utils;

import java.io.Serializable;

public final class ServiceResult<T> implements Serializable {
    private static final long serialVersionUID = 1900587519453953392L;
    private boolean succeed = false;
    private T data;
    private String msg;
    private String code;

    public ServiceResult() {
    }

    public ServiceResult(T data) {
        this.succeed = true;
        this.setData(data);
    }

    public boolean isSucceed() {
        return this.succeed;
    }

    public void setSucceed(boolean succeed) {
        this.succeed = succeed;
    }

    public String getMsg() {
        return this.msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return this.data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public String getCode() {
        return this.code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
