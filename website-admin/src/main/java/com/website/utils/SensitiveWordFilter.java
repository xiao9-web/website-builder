package com.website.utils;

import com.website.entity.CmsSensitiveWord;
import com.website.service.CmsSensitiveWordService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.*;

/**
 * 敏感词过滤器
 * 基于DFA算法实现
 */
@Component
public class SensitiveWordFilter implements CommandLineRunner {

    @Resource
    private CmsSensitiveWordService sensitiveWordService;

    /**
     * 敏感词库
     */
    private Map<Object, Object> sensitiveWordMap;

    /**
     * 最小匹配规则
     */
    public static final int MIN_MATCH_TYPE = 1;

    /**
     * 最大匹配规则
     */
    public static final int MAX_MATCH_TYPE = 2;

    @Override
    public void run(String... args) throws Exception {
        // 项目启动时加载敏感词
        reloadSensitiveWord();
    }

    /**
     * 重新加载敏感词库
     */
    public void reloadSensitiveWord() {
        List<CmsSensitiveWord> sensitiveWords = sensitiveWordService.list();
        Set<String> wordSet = new HashSet<>();
        for (CmsSensitiveWord word : sensitiveWords) {
            wordSet.add(word.getWord());
        }
        initSensitiveWordMap(wordSet);
    }

    /**
     * 初始化敏感词库
     */
    private void initSensitiveWordMap(Set<String> sensitiveWordSet) {
        sensitiveWordMap = new HashMap<>(sensitiveWordSet.size());
        Map<Object, Object> currentMap;
        Map<Object, Object> newMap;

        for (String word : sensitiveWordSet) {
            currentMap = sensitiveWordMap;
            for (int i = 0; i < word.length(); i++) {
                char key = word.charAt(i);
                Object wordMap = currentMap.get(key);
                if (wordMap != null) {
                    currentMap = (Map<Object, Object>) wordMap;
                } else {
                    newMap = new HashMap<>();
                    newMap.put("isEnd", "0");
                    currentMap.put(key, newMap);
                    currentMap = newMap;
                }
                if (i == word.length() - 1) {
                    currentMap.put("isEnd", "1");
                }
            }
        }
    }

    /**
     * 判断文本是否包含敏感词
     * @param text 待检查文本
     * @return true包含，false不包含
     */
    public boolean containsSensitiveWord(String text) {
        if (!StringUtils.hasText(text)) {
            return false;
        }
        for (int i = 0; i < text.length(); i++) {
            int matchFlag = checkSensitiveWord(text, i, MIN_MATCH_TYPE);
            if (matchFlag > 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取文本中的所有敏感词
     * @param text 待检查文本
     * @param matchType 匹配规则 1：最小匹配规则，2：最大匹配规则
     * @return 敏感词列表
     */
    public Set<String> getSensitiveWord(String text, int matchType) {
        Set<String> sensitiveWordList = new HashSet<>();
        if (!StringUtils.hasText(text)) {
            return sensitiveWordList;
        }
        for (int i = 0; i < text.length(); i++) {
            int length = checkSensitiveWord(text, i, matchType);
            if (length > 0) {
                sensitiveWordList.add(text.substring(i, i + length));
                i = i + length - 1;
            }
        }
        return sensitiveWordList;
    }

    /**
     * 替换敏感词
     * @param text 待替换文本
     * @param replaceChar 替换字符，默认***
     * @return 替换后的文本
     */
    public String replaceSensitiveWord(String text, String replaceChar) {
        if (!StringUtils.hasText(text)) {
            return text;
        }
        if (!StringUtils.hasText(replaceChar)) {
            replaceChar = "***";
        }
        Set<String> sensitiveWordSet = getSensitiveWord(text, MAX_MATCH_TYPE);
        for (String sensitiveWord : sensitiveWordSet) {
            // 获取替换字符串
            String replaceStr = getReplaceStr(replaceChar, sensitiveWord.length());
            text = text.replaceAll(sensitiveWord, replaceStr);
        }
        return text;
    }

    /**
     * 检查文字中是否包含敏感字符
     * @param text 待检查文本
     * @param beginIndex 开始位置
     * @param matchType 匹配规则
     * @return 如果存在，则返回敏感词字符的长度，不存在返回0
     */
    private int checkSensitiveWord(String text, int beginIndex, int matchType) {
        boolean flag = false;
        int matchFlag = 0;
        char word;
        Map<Object, Object> currentMap = sensitiveWordMap;
        for (int i = beginIndex; i < text.length(); i++) {
            word = text.charAt(i);
            currentMap = (Map<Object, Object>) currentMap.get(word);
            if (currentMap == null) {
                break;
            } else {
                matchFlag++;
                if ("1".equals(currentMap.get("isEnd"))) {
                    flag = true;
                    if (MIN_MATCH_TYPE == matchType) {
                        break;
                    }
                }
            }
        }
        if (matchFlag < 2 || !flag) {
            matchFlag = 0;
        }
        return matchFlag;
    }

    /**
     * 获取替换字符串
     */
    private String getReplaceStr(String replaceChar, int length) {
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < length; i++) {
            result.append(replaceChar);
        }
        return result.toString();
    }
}
