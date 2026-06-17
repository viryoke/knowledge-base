#!/bin/bash
set -e

echo "恢复 Hermes state.db..."
echo ""
echo "警告: 请先停止所有 Hermes 进程 (gateway, CLI 等)"
echo "  hermes gateway stop"
echo ""
read -p "是否已停止 Hermes? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 1
fi

if [ ! -f state.sql.gz ]; then
    echo "错误: 找不到 state.sql.gz"
    exit 1
fi

# 清理所有旧数据库文件 (含 WAL/SHM)
for f in state.db state.db-shm state.db-wal; do
    if [ -f "$f" ]; then
        echo "备份 $f -> ${f}.backup"
        mv "$f" "${f}.backup"
    fi
done

echo "解压 state.sql.gz..."
gunzip -k state.sql.gz

echo "导入到 state.db..."
sqlite3 state.db < state.sql
rm -f state.sql

chmod 600 state.db

echo ""
echo "验证..."
sqlite3 state.db "PRAGMA integrity_check;"
sqlite3 state.db "SELECT count(*) || ' 个会话' FROM sessions;"
sqlite3 state.db "SELECT count(*) || ' 条消息' FROM messages;"

echo ""
echo "完成! 现在可以重启 Hermes"
