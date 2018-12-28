The project serves the block chain business.
### Download
```sh
    git clone https://github.com/zeqi/blockchain.eos.git
```

# EOS主网搭建
## 前期准备
### 源码部分
>包括EOS源码获取 修改 编译等

* 源码修改

```sh
# 获取源码
$ git clone https://github.com/EOSIO/eos --recursive
$ git checkout -b v1.3.0 v1.3.0
# 修改代币符号
$ sed -i.bak '16i set( CORE_SYMBOL_NAME "EOS" )' CMakeLists.txt
# 修改根账户公钥,同时保存好自己的私钥
$ sed -i.bak '17i set( EOSIO_ROOT_KEY "EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s" )' CMakeLists.txt

# 以下是事先准备好的密钥对，也可以在网页（https://nadejde.github.io/eos-token-sale/）中生成

# root account
# Private key: 5KGssHcEe2czEEZ1TtsmCrZGsuptFWN8jxiGfxvTe3KnDjByJZd
# Public key: EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s

# inita account
# Private key: 5JkgtaHKFVSC7Roi58mBVNVkcDtnCgitMKMdZ6cDAwMr9vEVHrJ
# Public key: EOS8dFvnTCNYDtZjiExGFHmDxaKneNUvSZd1TV8pPV4ChaceaoNhk

# initb account
# Private key: 5JaC9FJW8Ey7QR39gFVRhuXyjPdBVjGJ3ApXs7xMC7UpsjudMea
# Public key: EOS54SBa7hTuL49ERjwiZUcNsdh3YgR5MrrzfP6hw2mSJn5NRQZ3b

# initc account
# Private key: 5JegbsECExQtAWwiUT63kvQW1HncmQx53iM1Q4We3qW83nvbm9s
# Public key: EOS6Ymcy3UuRCnMqzqWAYGxxV7UFJButmCpbv4NJRcHu7FyPoUz1z

# zhuzeqitoken-EOS7g3d8xYrzMJ5ZPR4f7Tw5xxiyyuacHNJe3PkDnDJ8XrMBJXKz5

# Private Key: 5JjR28jygo9fcXCGNtXwuKdxrLmZMcUSuFieiSZ1PrqbEUCmyM5 
# Public Key: EOS6Qggs2o1ybKyceBAwXJxUAnrpC167TPUpnYHyRY13rpPkv1ESa

# 修改出块节点，将21改成自定义的节点数
$ vim ./contracts/eosio.system/voting.cpp
# 源码中genesis.json文件魔板
$ vim ./tutorials/bios-boot-tutorial/genesis.json
# 源码中config.ini 文件魔板
$ vim Docker/config.ini
# 修改producer相关
$ vim libraries/chain/include/eosio/chain/config.hpp
# //const static int producer_repetitions = 12;
# const static int producer_repetitions = 6;
```
### 常用命令
>EOS节点 钱包 容器等工具的使用方法

* eos命令合集

```sh
# 创建genesis.json文件
$ nodeos --extract-genesis-json genesis.json
# 打印genesis-json
$ --print-genesis-json

# 启动各个节点的nodeos程序,如果私有链需要配置好各个节点相同的genesis.json文件和不同的config.ini文件
$ nodeos  --data-dir ./data --config-dir ./config  --genesis-json  ./config/genesis.json
# docker启动方式，可通过shell文件/opt/eosio/bin/nodeosd.sh查看启动的具体方式
$ docker run --name nodeos -p 8888:8888 -p 9876:9876 -t eosio/eos nodeosd.sh arg1 arg2
$ docker run --name nodeos -p 8888:8888 -p 9876:9876 -t eosio/eos /opt/eosio/bin/nodeosd.sh --config-dir /tmp/lecio/config
# docker启动eos测试节点方式
$ docker run --name nodeos -d -p 8888:8888 --network eosdev \
-v /tmp/eosio/work:/work -v /tmp/eosio/data:/mnt/dev/data \
-v /tmp/eosio/config:/mnt/dev/config eosio/eos-dev  \
/bin/bash -c "nodeos -e -p eosio --plugin eosio::producer_plugin \
--plugin eosio::history_plugin --plugin eosio::chain_api_plugin \
--plugin eosio::history_api_plugin \
 --plugin eosio::http_plugin -d /mnt/dev/data \
--config-dir /mnt/dev/config \
--http-server-address=0.0.0.0:8888 \
--access-control-allow-origin=* --contracts-console --http-validate-host=false"

$ docker run --name nodeos_1 -d -p 8888:8888 --network eosdev \
-v /tmp/nodeos_1/work:/work \
-v /tmp/nodeos_1/data:/mnt/dev/data \
-v /tmp/nodeos_1/config:/mnt/dev/config eosio/eos  \
/bin/bash -c "nodeos -e -p eosio \
--plugin eosio::producer_plugin \
--plugin eosio::history_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::history_api_plugin \
--plugin eosio::http_plugin \
-d /mnt/dev/data \
--config-dir /mnt/dev/config \
--http-server-address=0.0.0.0:8888 \
--access-control-allow-origin=* --contracts-console --http-validate-host=false"

# 创建一对秘钥
$ cleos create key --to-console
```

## 使用docker部署EOS私有链
### 准备工作
>docker镜像 启动方式等

* 技术前沿

```sh
# 安装docker有很多方式，具体可查看https://www.docker.com/community-edition

# 获取eos镜像
$ docker pull eosio/eos

# 启动nodeos
$ docker run --name nodeos -p 8888:8888 -p 9876:9876 -t eosio/eos /opt/eosio/bin/nodeosd.sh --config-dir /tmp/lecio/config
# 打印日志
$ docker logs -f --tail 10 nodeos
# 进入容器
$ docker exec -it nodeos bash
# 验证节点
$ curl http://127.0.0.1:8888/v1/chain/get_info
```

### 容器集群搭建
>一共4个节点 lecio inita initb initc

* 各个节点执行

```sh
# 创建网络
$ docker network create lecio

# 启动nodeos
$ docker run --name nodeos -d -p 8888:8888 -p 9876:9876 --network lecio \
-v /data/docker/eos/lecio:/mnt/lecio eosio/eos \
/bin/bash -c "nodeos -e -p eosio \
-d /mnt/lecio/data \
--config-dir /mnt/lecio/config \
--genesis-json  /mnt/lecio/config/genesis.json"

$ docker run --name keosd -d -p 8900:8900 --network=lecio \
-v /data/docker/eos/lecio/wallet:/root/eosio-wallet eosio/eos  \
/bin/bash -c "keosd --http-server-address=0.0.0.0:8900"

# 创世链启动后,如果再次启动服务时,不需要加载genesis.json配置文件了,执行如下shell即可启动
$ docker run --name nodeos -d -p 8888:8888 -p 9876:9876 --network lecio \
-v /data/docker/eos/lecio:/mnt/lecio eosio/eos  \
/bin/bash -c "nodeos -e -p eosio \
-d /mnt/lecio/data \
--config-dir /mnt/lecio/config"

# 启动kosed
# $ docker run -d --name lecio_keosd --network=lecio \
# -i eosio/eos /bin/bash -c "keosd --http-server-address=0.0.0.0:9876"

# 将容器中的工具映射到当前系统
# $ alias cleos='docker exec -it lecio /opt/eosio/bin/cleos --url http://127.0.0.1:8888'
# $ alias nodeos='docker exec -it lecio /opt/eosio/bin/nodeos'

# 进入lecio容器
$ docker exec -it lecio bash
```

* eosio节点上执行

```sh
# 创建钱包
$ cleos wallet create -f /root/eosio-wallet/wallet-default-private-key.txt
$ cleos wallet open

$ cleos wallet list

# 解锁钱包
$ cleos wallet unlock --password PW5JhUUn3MtNBhJCmWtZNPR2ct95n31Fdky7kfLZin6sNM2C3bVD7

# 导入秘钥
# $ cleos --wallet-url http://127.0.0.1:8900 --url http://192.168.154.157:8888 wallet import 5KXAsA1nizwEYAaWFA2uBUQqeHNhYA6hZ3dZ3tGb3X6aeW58UXF
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 wallet import --private-key 5KGssHcEe2czEEZ1TtsmCrZGsuptFWN8jxiGfxvTe3KnDjByJZd
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 wallet import --private-key 5JkgtaHKFVSC7Roi58mBVNVkcDtnCgitMKMdZ6cDAwMr9vEVHrJ
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 wallet import --private-key 5JaC9FJW8Ey7QR39gFVRhuXyjPdBVjGJ3ApXs7xMC7UpsjudMea
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 wallet import --private-key 5JegbsECExQtAWwiUT63kvQW1HncmQx53iM1Q4We3qW83nvbm9s

$ cleos wallet import --private-key 5KGssHcEe2czEEZ1TtsmCrZGsuptFWN8jxiGfxvTe3KnDjByJZd
$ cleos wallet import --private-key 5JkgtaHKFVSC7Roi58mBVNVkcDtnCgitMKMdZ6cDAwMr9vEVHrJ
$ cleos wallet import --private-key 5JaC9FJW8Ey7QR39gFVRhuXyjPdBVjGJ3ApXs7xMC7UpsjudMea
$ cleos wallet import --private-key 5JegbsECExQtAWwiUT63kvQW1HncmQx53iM1Q4We3qW83nvbm9s

# 创建九大系统用户
# eosio.bpay:矿工获取出块奖励的临时代管账户，增发EOS的1%的25%会先转到这个账户;
# eosio.msig:多重签名管理的账户;
# eosio.names:靓号账户拍卖管理的账户;
# eosio.ram:内存买卖管理的账户;
# eosio.ramfee:内存买卖收取手续费的账户，按照每笔交易千分之5的费率收取手续费;
# eosio.saving:增发EOS临时存放账户，增发总量 5%，其中80%放在此账户，另外 20%再分成25%和75%，分别给eosio.bpay和eosio.vpay;
# eosio.stake:管理EOS抵押的账户;
# eosio.token:发行和管理token的账户;
# eosio.vpay:矿工按照获得投票多少比例获取奖励的临时代管账户，增发EOS的1%的75%会先转到这个账户.
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.bpay EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.msig EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.names EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.ram EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.ramfee EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.saving EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.stake EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.token EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 create account eosio eosio.vpay EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s

$ cleos create account eosio eosio.bpay EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.msig EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.names EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.ram EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.ramfee EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.saving EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.stake EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.token EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s
$ cleos create account eosio eosio.vpay EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s

# 加载四大合约，发行代币,如果遇到（Error 3080006: Transaction took too long）错误，可以添加 -x 3000 选项
$ cleos  --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 set contract eosio.token /contracts/eosio.token/
$ cleos  --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 set contract eosio.msig /contracts/eosio.msig/
$ cleos  --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 push action eosio.token create '["eosio", "1000000000.0000 SYS"]' -p eosio.token
$ cleos  --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 push action eosio.token issue '["eosio", "1000000000.0000 SYS", "issue"]' -p eosio
$ cleos  --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 set contract eosio /contracts/eosio.system/
$ cleos  --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 push action eosio setpriv '["eosio.msig", 1]' -p eosio@active

$ cleos set contract eosio.token /contracts/eosio.token/
$ cleos set contract eosio.msig /contracts/eosio.msig/
$ cleos push action eosio.token create '["eosio", "1000000000.0000 SYS"]' -p eosio.token
$ cleos push action eosio.token issue '["eosio", "1000000000.0000 SYS", "issue"]' -p eosio
$ cleos set contract eosio /contracts/eosio.system/
$ cleos push action eosio setpriv '["eosio.msig", 1]' -p eosio@active

# 创建三个节点用户
# nodeos account signature-provider
# lecio: EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s=KEY:5KGssHcEe2czEEZ1TtsmCrZGsuptFWN8jxiGfxvTe3KnDjByJZd
# inita: EOS8dFvnTCNYDtZjiExGFHmDxaKneNUvSZd1TV8pPV4ChaceaoNhk=KEY:5JkgtaHKFVSC7Roi58mBVNVkcDtnCgitMKMdZ6cDAwMr9vEVHrJ
# initb: EOS54SBa7hTuL49ERjwiZUcNsdh3YgR5MrrzfP6hw2mSJn5NRQZ3b=KEY:5JaC9FJW8Ey7QR39gFVRhuXyjPdBVjGJ3ApXs7xMC7UpsjudMea
# initc: EOS6Ymcy3UuRCnMqzqWAYGxxV7UFJButmCpbv4NJRcHu7FyPoUz1z=KEY:5JegbsECExQtAWwiUT63kvQW1HncmQx53iM1Q4We3qW83nvbm9s
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio inita EOS8dFvnTCNYDtZjiExGFHmDxaKneNUvSZd1TV8pPV4ChaceaoNhk --stake-net "100000000.0000 SYS" --stake-cpu "100000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio inita "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio initb EOS54SBa7hTuL49ERjwiZUcNsdh3YgR5MrrzfP6hw2mSJn5NRQZ3b --stake-net "100000000.0000 SYS" --stake-cpu "100000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio initb "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio initc EOS6Ymcy3UuRCnMqzqWAYGxxV7UFJButmCpbv4NJRcHu7FyPoUz1z --stake-net "100000000.0000 SYS" --stake-cpu "100000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio initc "20000.0000 SYS"

$ cleos system newaccount --transfer eosio inita EOS8dFvnTCNYDtZjiExGFHmDxaKneNUvSZd1TV8pPV4ChaceaoNhk --stake-net "100000000.0000 SYS" --stake-cpu "100000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio inita "20000.0000 SYS"
$ cleos system newaccount --transfer eosio initb EOS54SBa7hTuL49ERjwiZUcNsdh3YgR5MrrzfP6hw2mSJn5NRQZ3b --stake-net "100000000.0000 SYS" --stake-cpu "100000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio initb "20000.0000 SYS"
$ cleos system newaccount --transfer eosio initc EOS6Ymcy3UuRCnMqzqWAYGxxV7UFJButmCpbv4NJRcHu7FyPoUz1z --stake-net "100000000.0000 SYS" --stake-cpu "100000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio initc "20000.0000 SYS"

$ cleos system newaccount --transfer eosio inita EOS8dFvnTCNYDtZjiExGFHmDxaKneNUvSZd1TV8pPV4ChaceaoNhk --stake-net "10000000.0000 SYS" --stake-cpu "10000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio inita "10000.0000 SYS"
$ cleos system newaccount --transfer eosio initb EOS54SBa7hTuL49ERjwiZUcNsdh3YgR5MrrzfP6hw2mSJn5NRQZ3b --stake-net "10000000.0000 SYS" --stake-cpu "10000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio initb "10000.0000 SYS"
$ cleos system newaccount --transfer eosio initc EOS6Ymcy3UuRCnMqzqWAYGxxV7UFJButmCpbv4NJRcHu7FyPoUz1z --stake-net "10000000.0000 SYS" --stake-cpu "10000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio initc "10000.0000 SYS"
# 60090000

# 注册节点候选人(bp)
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system regproducer inita EOS8dFvnTCNYDtZjiExGFHmDxaKneNUvSZd1TV8pPV4ChaceaoNhk
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system regproducer initb EOS54SBa7hTuL49ERjwiZUcNsdh3YgR5MrrzfP6hw2mSJn5NRQZ3b
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system regproducer initc EOS6Ymcy3UuRCnMqzqWAYGxxV7UFJButmCpbv4NJRcHu7FyPoUz1z

$ cleos system regproducer inita EOS8dFvnTCNYDtZjiExGFHmDxaKneNUvSZd1TV8pPV4ChaceaoNhk
$ cleos system regproducer initb EOS54SBa7hTuL49ERjwiZUcNsdh3YgR5MrrzfP6hw2mSJn5NRQZ3b
$ cleos system regproducer initc EOS6Ymcy3UuRCnMqzqWAYGxxV7UFJButmCpbv4NJRcHu7FyPoUz1z

# 使用命令进行投票
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system voteproducer prods inita inita
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system voteproducer prods initb initb
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system voteproducer prods initc initc

$ cleos system voteproducer prods inita inita
$ cleos system voteproducer prods initb initb
$ cleos system voteproducer prods initc initc

# 节点候选人以及投票率
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system listproducers
$ cleos system listproducers

# 创建三个普通用户
# //usera
# 5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr
# EOS69X3383RzBZj41k73CSjUNXM5MYGpnDxyPnWUKPEtYQmTBWz4D
# //userb
# 5JUNYmkJ5wVmtVY8x9A1KKzYe9UWLZ4Fq1hzGZxfwfzJB8jkw6u
# EOS7yBtksm8Kkg85r4in4uCbfN77uRwe82apM8jjbhFVDgEgz3w8S
# //userc
# 5K6LU8aVpBq9vJsnpCvaHCcyYwzPPKXfDdyefYyAMMs3Qy42fUr
# EOS7WnhaKwHpbSidYuh2DF1qAExTRUtPEdZCaZqt75cKcixuQUtdA
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio usera EOS69X3383RzBZj41k73CSjUNXM5MYGpnDxyPnWUKPEtYQmTBWz4D --stake-net "50000000.0000 SYS" --stake-cpu "50000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio usera "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio userb EOS7yBtksm8Kkg85r4in4uCbfN77uRwe82apM8jjbhFVDgEgz3w8S --stake-net "50000000.0000 SYS" --stake-cpu "50000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio userb "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio userc EOS7WnhaKwHpbSidYuh2DF1qAExTRUtPEdZCaZqt75cKcixuQUtdA --stake-net "50000000.0000 SYS" --stake-cpu "50000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio userc "20000.0000 SYS"

$ cleos system newaccount --transfer eosio usera EOS69X3383RzBZj41k73CSjUNXM5MYGpnDxyPnWUKPEtYQmTBWz4D --stake-net "50000000.0000 SYS" --stake-cpu "50000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio usera "20000.0000 SYS"
$ cleos system newaccount --transfer eosio userb EOS7yBtksm8Kkg85r4in4uCbfN77uRwe82apM8jjbhFVDgEgz3w8S --stake-net "50000000.0000 SYS" --stake-cpu "50000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio userb "20000.0000 SYS"
$ cleos system newaccount --transfer eosio userc EOS7WnhaKwHpbSidYuh2DF1qAExTRUtPEdZCaZqt75cKcixuQUtdA --stake-net "50000000.0000 SYS" --stake-cpu "50000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio userc "20000.0000 SYS"

$ cleos system newaccount --transfer eosio usera EOS69X3383RzBZj41k73CSjUNXM5MYGpnDxyPnWUKPEtYQmTBWz4D --stake-net "10000000.0000 SYS" --stake-cpu "40000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio usera "10000.0000 SYS"
$ cleos system newaccount --transfer eosio userb EOS7yBtksm8Kkg85r4in4uCbfN77uRwe82apM8jjbhFVDgEgz3w8S --stake-net "20000000.0000 SYS" --stake-cpu "20000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio userb "10000.0000 SYS"
$ cleos system newaccount --transfer eosio userc EOS7WnhaKwHpbSidYuh2DF1qAExTRUtPEdZCaZqt75cKcixuQUtdA --stake-net "40000000.0000 SYS" --stake-cpu "10000000.0000 SYS" --buy-ram "20000.0000 SYS"
$ cleos transfer eosio userc "10000.0000 SYS"

# 导入普通用户的密钥对
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 wallet import --private-key 5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 wallet import --private-key 5JUNYmkJ5wVmtVY8x9A1KKzYe9UWLZ4Fq1hzGZxfwfzJB8jkw6u
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 wallet import --private-key 5K6LU8aVpBq9vJsnpCvaHCcyYwzPPKXfDdyefYyAMMs3Qy42fUr

$ cleos wallet import --private-key 5JtUScZK2XEp3g9gh7F8bwtPTRAkASmNrrftmx4AxDKD5K4zDnr
$ cleos wallet import --private-key 5JUNYmkJ5wVmtVY8x9A1KKzYe9UWLZ4Fq1hzGZxfwfzJB8jkw6u
$ cleos wallet import --private-key 5K6LU8aVpBq9vJsnpCvaHCcyYwzPPKXfDdyefYyAMMs3Qy42fUr

# 使用普通用户的账号给三个出块节点投票看看
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system voteproducer prods usera initc

```

### 钱包

* 钱包相关操作

```sh
# 给创建的账户转账
$ cleos push action eosio.token transfer '["eosio", "inita","100000000.0000 SYS","vote"]' -p eosio
$ cleos push action eosio.token transfer '["eosio", "initb","100000000.0000 SYS","vote"]' -p eosio
$ cleos push action eosio.token transfer '["eosio", "initc","100000000.0000 SYS","vote"]' -p eosio

# 锁定代币
$ cleos system delegatebw inita inita '25000000.0000 SYS' '25000000.0000 SYS' 
$ cleos system delegatebw initb initb '25000000.0000 SYS' '25000000.0000 SYS' 
$ cleos system delegatebw initc initc '25000000.0000 SYS' '25000000.0000 SYS'

# 查看用户资金
# cleos get currency balance ${contract} ${account} ${symbol}
# contract· TEXT - 经营货币的合约 account TEXT - 查询余额的帐户 symbol TEXT - 货币的符号，如果合约操作多种货币
$ cleos get currency balance eosio.token eosio SYS
$ cleos get table eosio.token usera accounts

# 用户信息
$ cleos get account inita

# 账户抵押信息
$ cleos system listbw usera
$ cleos get table eosio usera delband

# 查询账户的代码以及abi
# cleos get code -a ${contract name}.abi ${contract name}
# name TEXT - 要查询其代码的帐户名称
# -c,--code TEXT - 保存contract.wast的文件的名称。 -a,--abi TEXT - 保存contract.abi的文件的名称。
$ cleos get code eosio.token
$ cleos get code eosio.token -a eosio.token.abi
$ cleos get code eosio.token -c eosio.token.wast

# 领取退款（三天后执行退款操作将赎回款转入账户余额）
$ cleos push action eosio refund '["<本人账户名>"]' -p <本人账户名>
$ cleos push action eosio refund '["userd"]' -p userd

# 查询与公钥关联的所有账户
$ cleos get accounts EOS8JnLDEu8eykw1JToW5rVLh9AxcCn9iEy2yCpZZFWoE5U4gUf5s

# 查询短名出价情况
$ cleos system bidnameinfo <短名>
$ cleos system bidnameinfo d
# 参与竞拍
$ cleos system bidname <本人账户名> <短名> '0.01 SYS'
$ cleos system bidname userd d '0.01 SYS'
$ cleos system bidname usere d '0.02 SYS'
$ cleos system bidname userd d '0.031 SYS'

# 获取一个密钥对
$ cleos create key --to-console
# userd
# Private key: 5K89GnbNXebjpkeVogvXVRuWutKB6YQJs11Ng9F7xBnwKWaSh39
# Public key: EOS8DJ7R7fPLxqUjN3Hnyg3HE3CmHrpgcovXMfXaLHxT3ZQEQ3ov6

# usere
# Private key: 5J5HxQ66tL5LHoYLkVntMua1AQCRmirNMMWsWCxMhEZP2v7MJ4k
# Public key: EOS6dk83T7fa4CEUBBGzJA19vGuExtvmyrQs3qxvrfNzk9V2A7Ce9

$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio userd EOS8DJ7R7fPLxqUjN3Hnyg3HE3CmHrpgcovXMfXaLHxT3ZQEQ3ov6 --stake-net "200.0000 SYS" --stake-cpu "200.0000 SYS" --buy-ram "1.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio userd "1.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system newaccount --transfer eosio usere EOS6dk83T7fa4CEUBBGzJA19vGuExtvmyrQs3qxvrfNzk9V2A7Ce9 --stake-net "1000000.0000 SYS" --stake-cpu "1000000.0000 SYS" --buy-ram "10000.0000 SYS"
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 transfer eosio userd "5.0000 SYS"

$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system voteproducer prods userd inita
$ cleos --wallet-url http://0.0.0.0:8900 --url http://10.140.40.17:8888 system voteproducer prods usere initb

$ cleos wallet import --private-key 5K89GnbNXebjpkeVogvXVRuWutKB6YQJs11Ng9F7xBnwKWaSh39
$ cleos wallet import --private-key 5J5HxQ66tL5LHoYLkVntMua1AQCRmirNMMWsWCxMhEZP2v7MJ4k

$ cleos system newaccount --transfer eosio userd EOS8DJ7R7fPLxqUjN3Hnyg3HE3CmHrpgcovXMfXaLHxT3ZQEQ3ov6 --stake-net "500.0000 SYS" --stake-cpu "500.0000 SYS" --buy-ram "0.5000 SYS"
$ cleos transfer eosio userd "1.0000 SYS"
$ cleos system newaccount --transfer eosio usere EOS6dk83T7fa4CEUBBGzJA19vGuExtvmyrQs3qxvrfNzk9V2A7Ce9 --stake-net "50000.0000 SYS" --stake-cpu "50000.0000 SYS" --buy-ram "5.0000 SYS"
$ cleos transfer eosio usere "5.0000 SYS"

$ cleos system voteproducer prods userd inita
$ cleos system voteproducer prods usere initb

# 查看节点及得票信息
$ cleos get table eosio eosio producers

# 定义一个环境变量
$ alias eos='cleos -u http://10.140.40.17:8888'
```

* 钱包接口

```sh
# /v1/wallet/create
# /v1/wallet/create_key
# /v1/wallet/get_public_keys
# /v1/wallet/import_key
# /v1/wallet/list_keys
# /v1/wallet/list_wallets
# /v1/wallet/lock
# /v1/wallet/lock_all
# /v1/wallet/open
# /v1/wallet/remove_key
# /v1/wallet/set_timeout
# /v1/wallet/sign_digest
# /v1/wallet/sign_transaction
# /v1/wallet/unlock
```

* 钱包http接口调用

```sh
# 创建钱包
$ curl http://localhost:8900/v1/wallet/create -X POST -d '"default"'

# 创建密钥对
$ curl http://localhost:8900/v1/wallet/create_key -X POST

# 打开钱包
$ curl http://localhost:8900/v1/wallet/open -X POST -d '"default"'

# 解锁钱包
$ curl http://localhost:8900/v1/wallet/unlock -X POST -d '["default", "PW5JhUUn3MtNBhJCmWtZNPR2ct95n31Fdky7kfLZin6sNM2C3bVD7"]'

# 导入私钥
$ curl http://localhost:8900/v1/wallet/import_key -X POST -d '["default","5K89GnbNXebjpkeVogvXVRuWutKB6YQJs11Ng9F7xBnwKWaSh39"]'
$ curl http://localhost:8900/v1/wallet/import_key -X POST -d '["default","5J5HxQ66tL5LHoYLkVntMua1AQCRmirNMMWsWCxMhEZP2v7MJ4k"]'

# 获取keys
$ curl http://localhost:8900/v1/wallet/get_public_keys

# 列出钱包
$ curl http://localhost:8900/v1/wallet/list_wallets

# 设置钱包自动上锁
$ curl http://localhost:8900/v1/wallet/set_timeout -X POST -d '10'

# 交易签名
$ curl http://localhost:8888/v1/wallet/sign_transaction-X POST -d '[{
    "ref_block_num":21453,
    "ref_block_prefix":3165644999,
    "expiration":"2017-12-08T10:28:49",
    "scope":["initb", "initc"],
    "read_scope":[],
    "messages":[{
        "code":"currency",
        "type":"transfer",
        "authorization":[{"account":"initb",
        "permission":"active"
        }],
        "data":"000000008093dd74000000000094dd74e803000000000000"
    }],
    "signatures":[]
    },
    ["EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV"],
    ""
    ]’

```