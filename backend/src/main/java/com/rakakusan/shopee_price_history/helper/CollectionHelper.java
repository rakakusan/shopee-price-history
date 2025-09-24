package com.rakakusan.shopee_price_history.helper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class CollectionHelper {
  public static <T> List<List<T>> partition(List<T> list, int size) {
    if (list == null || list.isEmpty())
      return Collections.emptyList();
    List<List<T>> parts = new ArrayList<>((list.size() + size - 1) / size);
    for (int i = 0; i < list.size(); i += size) {
      parts.add(list.subList(i, Math.min(list.size(), i + size)));
    }
    return parts;
  }
}
