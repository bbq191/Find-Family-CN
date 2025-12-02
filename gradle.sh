#!/bin/bash
# 为当前项目设置 Java 环境
export JAVA_HOME="D:/OpenJDK/23"
export PATH="$JAVA_HOME/bin:$PATH"

# 运行 gradlew 并传递所有参数
./gradlew "$@"
