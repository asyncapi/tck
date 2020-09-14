package org.asyncapi.parsers;

import java.util.concurrent.ExecutionException;

public interface IParser {
  public void parse(String fpath) throws InterruptedException, ExecutionException, IllegalArgumentException;
}
