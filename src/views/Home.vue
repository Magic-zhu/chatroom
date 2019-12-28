<template>
    <div class="ct">
        <header></header>

        <!-- 登录模块 -->
        <mu-paper class="login_wrapper" :z-depth="3" v-if="!loginStatus">
            <div class="login_item">
                <span>用户名：</span>
                <input type="text" v-model="user" class="sinput"/>
            </div>
            <div class="login_item">
                <span>密码:</span>
                <input type="password" v-model="pwd" class="sinput"/>
            </div>
            <div class="login_footer">
                <mu-button color="primary" @click="register()">注册</mu-button>
                <mu-button color="primary" @click="login()">登录</mu-button>
            </div>
        </mu-paper>

        <!-- 主界面 -->
        <mu-paper v-if="loginStatus" class="message_box" :z-depth="4">

            <!-- 左侧功能栏 -->
            <div class="function_pannel">
                <div class="function_pannel_ava" @click="openUserInfoPanel()">
                    <img :src="user_ava?user_ava:defaultAva" alt/>
                </div>
                <mu-tooltip content="聊天信息" placement="right">
                    <div class="function_pannel_chat" @click="changeActiveType('chat')">
                        <mu-icon size="40" value="chat" color="white" v-show="active_type!='chat'"></mu-icon>
                        <mu-icon size="40" value="chat" color="lightblue" v-show="active_type=='chat'"></mu-icon>
                    </div>
                </mu-tooltip>
                <mu-tooltip content="好友列表" placement="right">
                    <div class="function_pannel_friend" @click="changeActiveType('friend')">
                        <mu-icon size="40" value="contacts" color="white" v-show="active_type!='friend'"></mu-icon>
                        <mu-icon size="40" value="contacts" color="lightblue" v-show="active_type=='friend'"></mu-icon>
                    </div>
                </mu-tooltip>
            </div>

            <!-- 右侧功能区-->
            <div class="function_area" v-show="active_type=='chat'">

                <!-- 消息栏 -->
                <div class="messageList">
                    <div
                            v-for="(item, index) in messageList"
                            :key="index"
                            class="messageItem"
                            @click="focusMessageItem(item)"
                    >
                        <div class="messageItem_leftside">
                            <img :src="item.ava" alt/>
                            <span v-show="item.is_read===0"></span>
                        </div>
                        <div class="messageItem_rightside">
                            <span>{{item.user_name}}</span>
                            <p>{{item.message}}</p>
                        </div>
                    </div>
                </div>

                <!-- 聊天区域 -->
                <div class="chat_area">
                    <div class="chat_area_header">
                        <span class="chat_area_who">{{active_chat}}</span>
                    </div>
                    <div class="message_show">
                        <div
                                v-for="(item, index) in messages"
                                :key="index"
                                :class="item.user!=user?'message_item':'message_item_me'"
                        >
                            <img
                                    :src="item.ava"
                                    alt
                                    class="message_ava"
                                    v-if="item.user!=user"
                                    @click="openModal(item.user)"
                            />
                            <div class="message_item_right" v-if="item.user!=user">
                                <p class="message_title_you">
                                    <span>{{item.user}}</span>
                                    <span class="message_time">{{item.time}}</span>
                                    <span class="level_label"></span>
                                </p>
                                <p class="message_content_you">
                                    <span class="message_triangle_you"></span>
                                    {{item.message}}
                                </p>
                            </div>

                            <div class="message_item_right_me" v-if="item.user==user">
                                <p class="message_title_me">
                                    <span>{{item.user}}</span>
                                    <span class="message_time">{{item.time}}</span>
                                    <span class="level_label"></span>
                                </p>
                                <p class="message_content_me">
                                    <span class="message_triangle_me"></span>
                                    {{item.message}}
                                </p>
                            </div>
                            <img :src="item.ava" alt class="message_ava" v-if="item.user==user"/>
                        </div>
                    </div>
                    <div class="message_send">
                        <div class="message_function_bar"></div>
                        <div class="send_btn" @click="submitMessage"><span>发送</span></div>
                        <textarea v-model="message" class="send_message_box" @keypress.enter="submitMessage"/>
                    </div>
                </div>
            </div>

            <!-- 好友列表 -->
            <div class="function_area" v-show="active_type=='friend'">
                <div class="function_area_friend">
                    <mu-expansion-panel style="margin: 0;background-color:#eeeeee;padding: 0;">
                        <div slot="header">新朋友</div>
                        <div class="friendList">
                            <div
                                    class="messageItem"
                                    v-for="(item, index) in newFriendList"
                                    :key="index+'c'"
                                    @click="openBotttomSheet(index)"
                            >
                                <div class="messageItem_leftside">
                                    <img :src="item.from.user_ava" alt/>
                                </div>
                                <div class="messageItem_rightside">
                                    <span>{{item.from.user_name}}</span>
                                </div>
                            </div>
                        </div>
                    </mu-expansion-panel>
                    <mu-expansion-panel style="margin: 0;background-color:#eeeeee;padding: 0;">
                        <div slot="header">好友列表</div>
                        <div class="friendList">
                            <div
                                    class="messageItem"
                                    v-for="(item, index) in friendList"
                                    :key="index+'c'"
                                    @click="openBotttomSheet(index)"
                            >
                                <div class="messageItem_leftside">
                                    <img :src="item.user_ava" alt/>
                                </div>
                                <div class="messageItem_rightside">
                                    <span>{{item.user_name}}</span>
                                </div>
                            </div>
                        </div>
                    </mu-expansion-panel>
                </div>
            </div>
        </mu-paper>
        <!-- 弹层类 -->

        <!--添加好友弹窗-->
        <mu-dialog title="提示" width="360" :open.sync="addFriendModal">
            要加此人为好友吗？
            <mu-button slot="actions" flat color="primary" @click="sendAddFriendTask()">是</mu-button>
            <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog()">否</mu-button>
        </mu-dialog>

        <!--个人信息面板弹窗-->
        <mu-dialog title="设置" width="500" height="600" :open.sync="personnalInfoModal">
            <div class="pannel_box">
                <div class="left_side">
                    <div>账号设置</div>
                    <div>通用设置</div>
                    <div>关于聊天室</div>
                </div>
                <div class="right_side">
                    <div class="account_setting">
                        <img :src="user_ava" alt class="mb10"/>
                        <span class="mb10">用户账号:{{user}}</span>
                        <mu-button slot="actions">退出登录</mu-button>
                    </div>
                </div>
            </div>
        </mu-dialog>

        <mu-container>
            <mu-bottom-sheet :open.sync="bottomSheetOpen">
                <mu-list @item-click="closeBottomSheet()">
                    <mu-sub-header>Select One</mu-sub-header>
                    <mu-list-item button @click="selectBottomSheet('chat')">
                        <mu-list-item-action>
                            <mu-icon value="chat" color="green"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>发消息</mu-list-item-title>
                    </mu-list-item>
                    <mu-list-item button>
                        <mu-list-item-action>
                            <mu-icon value="close" color="red"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>删除好友</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
            </mu-bottom-sheet>
        </mu-container>
    </div>
</template>
<script>
  import io from "socket.io-client";
  import localforage from "localforage";
  import defaultAva from "../assets/defaultAva.png";

  const socket = io("http://localhost:8086", {
    transports: ["websocket", "xhr-polling", "jsonp-polling"],
    autoConnect: false
  }); //顺带解决本地的跨域
  import { login, register, checkLogin, getFriendList } from "../api/chat";

  export default {
    data() {
      return {
        messageList: [
          {
            user_name: "聊天广场",
            message: "",
            ava: "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1869386756,1749725382&fm=26&gp=0.jpg",
            is_read: 1,
            message_list: []
          }
        ], //消息栏
        loginStatus: false,
        loading: true,
        user: "",
        pwd: "",
        addFriendModal: false, // 加好友的弹窗
        modal_active_user: null, // 加好友弹窗暂存的被添加者
        personnalInfoModal: false, //个人信息弹窗
        user_ava: "",
        defaultAva, //默认头像
        friendList: [],
        newFriendList: [],//新的好友请求列表
        bottomSheetOpen: false,
        bottomNowIndex: null, //当前正在操作的好友 在数组中的位置
        active_type: "chat",
        messages: [], //当前聊天框聊天信息
        active_chat: "聊天广场",//当前聊天框所属
        message: "" //发送框内的信息
      };
    },
    mounted() {
      //处理连接
      socket.on("connect", () => {
        this.$toast.success("聊天室连接正常");
      });
      //处理失连
      socket.on("disconnect", () => {
        this.$toast.error("失去连接");
      });
      //检查是否已经登录过
      this.checkIfLogin();
      //处理广播
      socket.on("sayback", data => {
        "/;.";
        let index = this.findIndexByUsername("聊天广场");
        if (this.active_chat === "聊天广场") {
          this.messageList[index].is_read = 1;
          this.messageList[index].message = data.message;
          this.messageList[index].message_list.push(data);
          this.messages.push(data);
        } else {
          this.messageList[index].message_list.push(data);
          this.messageList[index].is_read = 0;
        }
      });

      //接收点对点聊天消息
      socket.on("chatBack", data => {
        this.handleChatMessage(data);
      });

      socket.on("chatBackSelf", data => {
        let index = this.findIndexByUsername(this.active_chat);
        this.messages.push(data);
        this.messageList[index].message_list.push(data);
        this.syncToLocal();
      });

      //聊天广场 处理自己的消息
      socket.on("self", data => {
        this.messages.push(data);
        this.messageList[0].message_list.push(data);
      });

      //别人发来的好友请求
      socket.on("addFriendFrom", data => {
        this.newFriendList.unshift(data);
      });

      //检查离线消息
      socket.on('offLineMessages',data=>{
        data.forEach((item)=>{
            this.handleChatMessage(item)
        })
        socket.emit('offLineMessagesReceived')
      });

      //处理系统消息
      socket.on("systemMessage", data => {
      });
    },
    beforeDestroy() {
      socket.close();
    },
    methods: {
      initData() {
        //用户头像
        localforage.getItem("user_ava", (err, value) => {
          err && console.error(err);
          this.user_ava = value;
        });
        //消息记录
        localforage.getItem("chatHistory_" + this.user, (err, value) => {
          err && console.error(err);
          this.messageList = value || this.messageList;
        });
      },
      //聊天广场
      submitMessage(e) {
        e.preventDefault();
        if (this.message == "") return;
        if (this.active_chat == "聊天广场") { //群发
          socket.emit("say", {
            message: this.message,
            user: this.user,
            user_ava: this.user_ava,
            type: 1
          });
        } else { //点对点聊天
          this.chat();
        }
        this.message = "";
        this.syncToLocal();
      },
      /**
       * @params - to 发送对象
       */
      chat() {
        socket.emit("chat", {
          message: this.message,
          user: this.user,
          user_ava: this.user_ava,
          to: this.active_chat,
          type: 2
        });
      },
      //登录
      login() {
        login(this.user, this.pwd).then(res => {
          if (res.data.errcode == 0) {
            socket.emit("newUser", { user: this.user });
            this.user_ava = res.data.data.user_ava;
            localforage.setItem("token", res.data.data.token);
            localforage.setItem("user_ava", res.data.data.user_ava);
            socket.open();
            this.loginStatus = true;
            this.$toast.success("登录成功");
          } else {
            this.$toast.error(res.data.message);
          }
        });
      },

      //注册
      register() {
        register(this.user, this.pwd).then(res => {
          if (res.data.errcode == 0) {
            this.$toast.success("注册成功,请登录");
          } else {
            this.$toast.error(res.data.message);
          }
        });
      },

      //检查是否登录
      checkIfLogin() {
        localforage.getItem("token", (err, value) => {
          if (!err) {
            checkLogin(value).then(res => {
              if (res.data.errcode == 0) {
                socket.open();
                this.user = res.data.data.user_name;
                this.user_ava = res.data.data.user_ava;
                localforage.setItem("user_ava", res.data.data.user_ava);
                socket.emit("newUser", { user: res.data.data.user_name });
                this.initData();
                this.loginStatus = true;
              }
            });
          } else {
            this.loading = false;
          }
        });
      },

      //点击消息栏某个消息
      focusMessageItem(item) {
        this.active_chat = item.user_name;
        item.is_read = 1; //利用引用
        this.message = "";
        this.messages = item.message_list;
        this.syncToLocal();
      },

      changeActiveType(type) {
        this.active_type = type;
        if (type == "friend") {
          this.getFriendList();
        }
      },

      openModal(user_name) {
        this.modal_active_user = user_name;
        this.addFriendModal = true;
      },

      closeSimpleDialog() {
        this.modal_active_user = null;
        this.addFriendModal = false;
      },

      //打开用户信息面板
      openUserInfoPanel() {
        this.personnalInfoModal = true;
      },
      //关闭用户信息面板
      closeUserInfoPanel() {
        this.personnalInfoModal = false;
      },

      //请求添加好友
      sendAddFriendTask() {
        io.emit(
          "addFriendTo", {
            from: {
              user_name: this.user,
              user_ava: this.user_ava
            },
            to: this.modal_active_user
          }
        );
      },

      getFriendList() {
        localforage
          .getItem("token")
          .then(token => {
            return getFriendList(this.user, token);
          })
          .then(res => {
            if (res.data.errcode == 0) {
              console.log(res.data.data.user_friends);
              this.friendList = res.data.data.user_friends;
            }
          });
      },

      closeBottomSheet(value) {
        this.bottomSheetOpen = false;
      },

      openBotttomSheet(index) {
        this.bottomNowIndex = index;
        this.bottomSheetOpen = true;
      },

      selectBottomSheet(type) {
        switch (type) {
          case "chat":
            this.active_type = "chat";
            this.message = "";
            //观察是否已经存在活动的对话列表
            for (let i = 0; i < this.messageList.length; i++) {
              if (
                this.messageList[i].user_name ==
                this.friendList[this.bottomNowIndex].user_name
              ) {
                //如果存在了 切换到当前这个人
                this.focusMessageItem(this.messageList[i])
                return;
              }
            }
            this.messageList.push({
              user_name: this.friendList[this.bottomNowIndex].user_name,
              message: "",
              ava: this.friendList[this.bottomNowIndex].user_ava,
              is_read: 1,
              message_list: []
            });
            break;
          case "delete":
            break;
        }
      },

      /**
       * 找到对应账号的人在数组中的位置
       */

      findIndexByUsername(name) {
        for (let i = 0; i < this.messageList.length; i++) {
          if (this.messageList[i].user_name == name) {
            return i;
          }
        }
        return -1;
      },

      /**
       * 同步到本地历史记录
       */
      syncToLocal() {
        localforage.setItem("chatHistory_" + this.user, this.messageList);
      },

      handleChatMessage(data){
        let index = this.findIndexByUsername(data.user);
        if (index == -1) {
          this.messageList.push({
            user_name: data.user,
            message: data.message,
            ava: data.ava,
            is_read: 0,
            message_list: [data]
          });
        } else {
          //创建一个未读消息
          this.messageList[index].message = data.message;
          this.messageList[index].message_list.push(data);
          this.messageList[index].is_read = 0;
          if (this.active_chat == data.user) { //如果是当前聊天
            this.messages.push(data);
            this.messageList[index].is_read = 1;
          }
        }
        this.syncToLocal();
      },
    }
  };
</script>
<style lang="less" scoped>
    .ct {
        height: 100%;
        width: 100%;
        background: -webkit-linear-gradient(-225deg,
        rgba(239, 0, 252, 1) 0,
        rgba(109, 9, 239, 1) 100%);
        background: -moz-linear-gradient(315deg,
        rgba(239, 0, 252, 1) 0,
        rgba(109, 9, 239, 1) 100%);
        background: linear-gradient(315deg,
        rgba(239, 0, 252, 1) 0,
        rgba(109, 9, 239, 1) 100%);
        background-position: 50% 50%;
        overflow: hidden;
        position: relative;

        header {
            font-size: 50px;
            text-align: center;
            color: white;
            margin-top: 30px;
        }

        .login_wrapper {
            opacity: 1;
            background-color: white;
            width: 350px;
            height: 260px;
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;

            .login_item {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 20px;

                span {
                    width: 80px;
                }
            }

            .login_footer {
                width: 100%;
                display: flex;
                justify-content: space-around;
            }
        }
    }

    .message_box {
        background-color: white;
        margin: 30px auto;
        width: 900px;
        height: 600px;
        display: flex;

        .function_pannel {
            width: 70px;
            height: 100%;
            background-color: #333333;
            display: flex;
            flex-direction: column;
            align-items: center;

            .function_pannel_ava {
                width: 70px;
                height: 70px;
                padding: 10px;
                cursor: pointer;

                img {
                    width: 50px;
                    height: 50px;
                }
            }

            .function_pannel_chat {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 20px;
            }

            .function_pannel_friend {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 20px;
            }
        }

        .function_area {
            flex: 1;
            display: flex;

            .messageList {
                width: 260px;

                .messageItem {
                    width: 100%;
                    height: 60px;
                    border-bottom: 1px solid #eeeeee;
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    cursor: pointer;

                    .messageItem_leftside {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        width: 40px;
                        height: 40px;

                        img {
                            width: 40px;
                            height: 40px;
                        }

                        span {
                            position: absolute;
                            width: 10px;
                            height: 10px;
                            border-radius: 5px;
                            background-color: red;
                            right: -5px;
                            top: -5px;
                        }
                    }

                    .messageItem_rightside {
                        margin-left: 10px;

                        p {
                            color: grey;
                            font-size: 10px;
                        }
                    }
                }
            }

            .chat_area {
                flex: 1;

                .chat_area_header {
                    height: 70px;
                    background-color: rgb(243, 243, 243);
                    display: flex;
                    align-items: center;
                    font-size: 20px;
                    padding: 0 20px;
                }
            }

            .friendList {
                .messageList();
                background-color: #eeeeee;
            }

            .friendInfo {
                .chat_area();
            }

            .function_area_friend {
                width: 308px;
                background-color: #eeeeee;
            }
        }

        .message_show {
            height: 400px;
            margin: 0 auto;
            overflow-y: auto;
            background-color: rgb(243, 243, 243);
            padding: 20px;
            border-bottom: 1px solid #cccccc;
            border-top: 1px solid #cccccc;

            .message_time {
                font-size: 10px;
            }

            .message_title_you {
                color: grey;
                font-size: 14px;

                span {
                    margin-left: 10px;
                }
            }

            .message_title_me {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: grey;
                font-size: 14px;

                span {
                    margin-right: 10px;
                }
            }

            .message_item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
                width: 100%;
            }

            .message_item_me {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                margin-bottom: 10px;
                width: 100%;
            }

            .message_content_me {
                position: relative;
                padding: 5px;
                margin-right: 20px;
                min-height: 30px;
                border-radius: 5px;
                background-color: lightblue;
                min-width: 200px;
                max-width: 300px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                word-break: break-all;
            }

            .message_content_you {
                position: relative;
                padding: 5px;
                margin-left: 20px;
                min-height: 30px;
                border-radius: 5px;
                background-color: white;
                min-width: 200px;
                max-width: 300px;
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                word-break: break-all;
            }

            .message_ava {
                width: 50px;
                height: 50px;
                border-radius: 8px;
                cursor: pointer;
            }

            .message_triangle_me {
                position: absolute;
                right: -12px;
                top: 10px;
                height: 0;
                width: 6px;
                border-top: 6px solid lightblue;
                border-bottom: 6px solid lightblue;
                border-left: 6px solid lightblue;
                border-right: 6px solid lightblue;
                border-right-color: transparent;
                border-bottom-color: transparent;
                border-top-color: transparent;
            }

            .message_triangle_you {
                position: absolute;
                left: -12px;
                top: 10px;
                height: 0;
                width: 6px;
                border-top: 6px solid white;
                border-bottom: 6px solid white;
                border-left: 6px solid white;
                border-right: 6px solid white;
                border-left-color: transparent;
                border-bottom-color: transparent;
                border-top-color: transparent;
            }
        }

        .message_send {
            width: 100%;
            height: 130px;
            background-color: rgb(243, 243, 243);
            position: relative;

            .send_message_box {
                height: 36px;
                box-sizing: border-box;
                width: 400px;
                border: none;
                background-color: #eeeeee;
                width: 100%;
                height: 100px;
                outline: none;
                box-sizing: border-box;
                padding: 10px;
                resize: none;
            }

            .message_function_bar {
                width: 100%;
                height: 30px;
                display: flex;
                background-color: #eeeeee;
                background-color: #eaeaea;
            }

            .send_btn {
                width: 80px;
                height: 36px;
                position: absolute;
                right: 20px;
                bottom: 20px;
                border: 1px solid #eeeeee;
                padding: 2px 10px;
                background-color: #cccccc;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;

                &:hover {
                    background-color: lightblue;
                    color: white;
                    cursor: pointer;
                }
            }
        }
    }

    .pannel_box {
        display: flex;
        height: 400px;

        .left_side {
            width: 100px;
            cursor: pointer;
            border-right: 1px solid #eeeeee;

            div:hover {
                color: lightblue;
            }
        }

        .right_side {
            flex: 1;
            padding: 20px;

            .account_setting {
                display: flex;
                flex-direction: column;
                align-items: center;

                img {
                    width: 80px;
                    height: 80px;
                }
            }
        }
    }

    .sinput {
        height: 36px;
        box-sizing: border-box;
        border: 1px solid lightgray;
        width: 200px;
        border-radius: 8px;
        padding: 0 10px;
        outline: none;
    }

    .mr20 {
        margin-right: 20px;
    }

    .mt10 {
        margin-top: 10px;
    }

    .mb10 {
        margin-bottom: 10px;
    }
</style>