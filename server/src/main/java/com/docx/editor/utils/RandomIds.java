//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.docx.editor.utils;

import java.security.SecureRandom;
import java.util.UUID;

public class RandomIds {
    private static SecureRandom random = new SecureRandom();

    private RandomIds() {
    }

    public static void main(String[] args) {
        System.out.println(random.nextLong());
    }

    public static String uuid() {
        return UUID.randomUUID().toString().replaceAll("-", "");
    }

    public static long randomLong() {
        return random.nextLong();
    }
}
