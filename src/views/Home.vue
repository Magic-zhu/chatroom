<template>
  <div class="ct">
    <!-- <header>v1.1.0</header> -->
    <!-- 登录模块 -->
    <mu-paper class="login_wrapper" :z-depth="3" v-if="!loginStatus">
      <div class="login_item">
        <span>用户名：</span>
        <input type="text" v-model="user" class="sinput" />
      </div>
      <div class="login_item">
        <span>密码:</span>
        <input type="password" v-model="pwd" class="sinput" />
      </div>
      <div class="login_footer">
        <mu-button color="primary" @click="register()">注册</mu-button>
        <mu-button color="primary" @click="login()">登录</mu-button>
      </div>
    </mu-paper>

    <!-- 主界面 -->
    <mu-paper v-show="loginStatus" class="message_box" :z-depth="4">
      <!-- 左侧功能栏 -->
      <div class="function_pannel">
        <div class="function_pannel_ava" @click="openUserInfoPanel()">
          <img :src="user_ava ? user_ava : defaultAva" alt />
        </div>
        <mu-tooltip content="聊天信息" placement="right">
          <div class="function_pannel_chat" @click="changeActiveType('chat')">
            <mu-icon
              size="40"
              value="chat"
              color="white"
              v-show="active_type != 'chat'"
            ></mu-icon>
            <mu-icon
              size="40"
              value="chat"
              color="lightblue"
              v-show="active_type == 'chat'"
            ></mu-icon>
          </div>
        </mu-tooltip>
        <mu-tooltip content="好友列表" placement="right">
          <div
            class="function_pannel_friend"
            @click="changeActiveType('friend')"
          >
            <mu-icon
              size="40"
              value="contacts"
              color="white"
              v-show="active_type != 'friend'"
            ></mu-icon>
            <mu-icon
              size="40"
              value="contacts"
              color="lightblue"
              v-show="active_type == 'friend'"
            ></mu-icon>
          </div>
        </mu-tooltip>
        <mu-tooltip content="添加好友" placement="right">
          <div class="function_pannel_friend" @click="addFriend()">
            <mu-icon size="40" value="add_box" color="white"></mu-icon>
          </div>
        </mu-tooltip>
      </div>

      <!-- 右侧功能区-->
      <div class="function_area" v-show="active_type == 'chat'">
        <!-- 消息栏 -->
        <div class="messageList">
          <div
            v-for="(item, index) in messageList"
            :key="index"
            :class="active_chat==item.user_name?'messageItem messageItemActive':'messageItem'"
            @click="focusMessageItem(item.user_name, index)"
          >
            <div class="messageItem_leftside">
              <img :src="item.ava" alt />
              <span v-show="item.is_read === 0"></span>
            </div>
            <div class="messageItem_rightside">
              <span>{{ item.user_name }}</span>
              <div v-html="item.message"></div>
            </div>
          </div>
        </div>

        <!-- 聊天区域 -->
        <div class="chat_area">
          <div class="chat_area_header">
            <span class="chat_area_who">{{ active_chat }}</span>
          </div>
          <div class="message_show">
            <div
              v-for="(item, index) in messages"
              :key="index"
              :class="item.user != user ? 'message_item' : 'message_item_me'"
            >
              <img
                :src="item.ava"
                alt
                class="message_ava"
                v-if="item.user != user"
                @click="openModal(item.user)"
              />
              <div class="message_item_right" v-if="item.user != user">
                <p class="message_title_you">
                  <span>{{ item.user }}</span>
                  <span class="message_time">{{ item.time }}</span>
                  <span class="level_label"></span>
                </p>
                <div class="message_content_you">
                  <span class="message_triangle_you"></span>
                  <div v-html="item.message"></div>
                </div>
              </div>

              <div class="message_item_right_me" v-if="item.user == user">
                <p class="message_title_me">
                  <span>{{ item.user }}</span>
                  <span class="message_time">{{ item.time }}</span>
                  <span class="level_label"></span>
                </p>
                <div class="message_content_me">
                  <span class="message_triangle_me"></span>
                  <div v-html="item.message"></div>
                </div>
              </div>
              <img
                :src="item.ava"
                alt
                class="message_ava"
                v-if="item.user == user"
              />
            </div>
          </div>
          <div class="message_send">
            <!-- <div class="message_function_bar">
              <div class="item">
                <mu-icon size="25" value="mood" color="black"></mu-icon>
              </div>
            </div>-->
            <div class="send_btn" @click="submitMessage">
              <span>发送(ctrl+Enter)</span>
            </div>
            <div
              ref="editor"
              class="editor"
              @keypress="handleEditorKeyPress($event)"
            ></div>
          </div>
        </div>
      </div>

      <!-- 好友列表 -->
      <div class="function_area" v-show="active_type == 'friend'">
        <mu-paper :z-depth="1" class="function_area_friend">
          <mu-list>
            <mu-sub-header>新的朋友</mu-sub-header>
            <mu-list-item
              avatar
              button
              :ripple="false"
              v-for="(item, index) in newFriendList"
              :key="'new_friend' + index"
              @click="handleNewFriendTask(index)"
            >
              <mu-list-item-action>
                <mu-avatar>
                  <img :src="item.from.user_ava" alt />
                </mu-avatar>
              </mu-list-item-action>
              <mu-list-item-title>{{ item.from.user_name }}</mu-list-item-title>
              <mu-list-item-action>
                <mu-icon value="chat_bubble"></mu-icon>
              </mu-list-item-action>
            </mu-list-item>
            <mu-divider></mu-divider>
            <mu-sub-header>好友列表</mu-sub-header>
            <mu-list-item
              avatar
              button
              :ripple="false"
              v-for="(item, index) in friendList"
              :key="index + 'c'"
              @click="openBotttomSheet(index)"
            >
              <mu-list-item-action>
                <mu-avatar>
                  <img :src="item.user_ava" alt />
                </mu-avatar>
              </mu-list-item-action>
              <mu-list-item-title>{{ item.user_name }}</mu-list-item-title>
              <mu-list-item-action>
                <mu-icon value="chat_bubble"></mu-icon>
              </mu-list-item-action>
            </mu-list-item>
          </mu-list>
        </mu-paper>
      </div>
    </mu-paper>
    <!-- 弹层类 -->

    <!--添加好友弹窗-->
    <mu-dialog title="提示" width="360" :open.sync="addFriendModal">
      要加此人为好友吗？
      <mu-button
        slot="actions"
        flat
        color="primary"
        @click="sendAddFriendTask()"
        >是</mu-button
      >
      <mu-button
        slot="actions"
        flat
        color="primary"
        @click="closeSimpleDialog()"
        >否</mu-button
      >
    </mu-dialog>

    <!--处理添加好友任务的弹窗-->
    <mu-dialog title="提示" width="360" :open.sync="newFriendTaskModal">
      接受此人的好友请求吗？
      <mu-button
        slot="actions"
        flat
        color="success"
        @click="agreeFriendRequest()"
        >是</mu-button
      >
      <mu-button
        slot="actions"
        flat
        color="primary"
        @click="disagreeFriendRequest()"
        >否</mu-button
      >
    </mu-dialog>

    <!--        <mu-dialog title="输入账号?" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openAlert">-->
    <!--            <mu-text-field v-model="form.input"></mu-text-field>-->
    <!--            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">Disagree</mu-button>-->
    <!--            <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">Agree</mu-button>-->
    <!--        </mu-dialog>-->

    <!--个人信息面板弹窗-->
    <mu-dialog
      title="设置"
      width="500"
      height="600"
      :open.sync="personnalInfoModal"
    >
      <div class="pannel_box">
        <div class="left_side">
          <div :class="pannel_active == 0 ? 'active' : ''">账号设置</div>
        </div>
        <div class="right_side">
          <div class="account_setting">
            <div class="ava mb10">
              <img :src="user_ava" alt />
              <mu-button slot="actions" @click="uploadAva()"
                >上传头像</mu-button
              >
            </div>
            <span class="mb10">用户账号:{{ user }}</span>
            <mu-button slot="actions" color="primary" @click="loginOut()"
              >退出登录</mu-button
            >
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
          <mu-list-item button @click="deleteFriend()">
            <mu-list-item-action>
              <mu-icon value="close" color="red"></mu-icon>
            </mu-list-item-action>
            <mu-list-item-title>删除好友</mu-list-item-title>
          </mu-list-item>
        </mu-list>
      </mu-bottom-sheet>
    </mu-container>
    <input type="file" ref="file" style="display:none" />
  </div>
</template>
<script>
import io from "socket.io-client";
import localforage from "localforage";
import defaultAva from "../assets/defaultAva.png";
import Editor from "wangeditor";
// const socket = io("http://47.105.210.34:8086", {
//   transports: ["websocket", "xhr-polling", "jsonp-polling"],
//   autoConnect: false
// }); //顺带解决本地的跨域

const socket = io("http://localhost:8086", {
  transports: ["websocket", "xhr-polling", "jsonp-polling"],
  autoConnect: false
}); //顺带解决本地的跨域

import {
  login,
  register,
  checkLogin,
  getFriendList,
  addFriend,
  uploadFile,
  setUserAva,
  deleteFriend
} from "../api/chat";

export default {
  data() {
    return {
      token: "",
      loginStatus: false,
      loading: true,
      user: "",
      pwd: "",
      user_ava: "",
      defaultAva, //默认头像
      bottomNowIndex: null, //当前正在操作的好友 在数组中的位置
      message: "", //发送框内的信息
      /**
       * 当前状态下选中的状态 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       */
      active_type: "chat",
      active_chat: "聊天广场", //当前聊天框所属
      modal_active_user: null, // 加好友弹窗暂存的被添加者
      active_new_friend: null, //当前正在操作的好友请求 数组中的位置
      pannel_active: 0,
      /**
       * 各个列表~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       */
      messages: [], //当前聊天框聊天信息
      stickList: [], //置顶的聊天会话
      messageList: [
        {
          user_name: "聊天广场",
          message: "",
          ava:
            "http://cdn.magiczhu.cn/chatroom/images/chatroom.png",
          is_read: 1,
          message_list: []
        }
      ], //消息栏
      friendList: [], //好友列表
      newFriendList: [], //新的好友请求列表
      /**
       * 各类弹窗~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       */
      newFriendTaskModal: false, // 处理好友请求的弹窗
      bottomSheetOpen: false, // 点击好友列表弹窗
      addFriendModal: false, // 加好友的弹窗
      personnalInfoModal: false, // 个人信息弹窗
      input_addFriendDialog: false, //输入好友账号 添加好友
      /**
       * 编辑器实例~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
       */
      editor: undefined
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
      this.loginStatus = false;
    });
    //检查是否已经登录过
    this.checkIfLogin();
    //处理广播
    socket.on("sayback", data => {
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

    //处理自己发出去的消息
    socket.on("chatBackSelf", data => {
      let index = this.findIndexByUsername(this.active_chat);
      this.messages.push(data);
      this.messageList[index].message_list.push(data);
      this.srcollToBottom();
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
      this.$toast.info("有人加您为好友");
    });

    //拒绝好友请求的信息
    socket.on("refuseFriendFrom", data => {
      this.$toast.warning(data.from + "拒绝您的好友请求");
    });

    //检查离线消息
    socket.on("offLineMessages", data => {
      data.forEach(item => {
        this.handleChatMessage(JSON.parse(item));
      });
      socket.emit("offLineMessagesReceived", { user: this.user });
    });

    //检查离线好友请求
    socket.on("offLineFriendRequest", data => {
      console.log(data);
      data.forEach(item => {
        this.newFriendList.unshift(item);
        this.$toast.info("有人加您为好友");
      });
      socket.emit("offLineFirendRequestReceived", { user: this.user });
    });

    //监听上传头像
    this.$refs.file.onchange = e => {
      let postData = new FormData();
      postData.append("file", e.target.files[0]);
      this.loading = true;
      uploadFile(postData)
        .then(res => {
          this.user_ava = res.data.data;
          return setUserAva(this.user, res.data.data, this.token);
        })
        .then(res => {
          if (res.data.errcode == 0) {
            this.loading = false;
            this.$toast.success("上传头像成功");
          } else {
            this.$toast.error("上传头像失败");
          }
        });
    };
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
      this.getFriendList();
    },
    //聊天广场
    submitMessage(e) {
      e && e.preventDefault();
      if (this.message == "") return;
      if (this.active_chat == "聊天广场") {
        //群发
        socket.emit("say", {
          message: this.message,
          user: this.user,
          user_ava: this.user_ava,
          type: 1
        });
      } else {
        //点对点聊天
        this.chat();
      }
      this.message = "";
      this.editor.txt.html("");
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

    /**
     * 登录
     */
    login() {
      login(this.user, this.pwd).then(res => {
        if (res.data.errcode == 0) {
          socket.emit("newUser", { user: this.user });
          this.user_ava = res.data.data.user_ava;
          this.token = res.data.data.token;
          localforage.setItem("token", res.data.data.token);
          localforage.setItem("user_ava", res.data.data.user_ava);
          localforage.getItem("chatHistory_" + this.user, (err, value) => {
            err && console.error(err);
            this.messageList = value || this.messageList;
          });
          socket.open();
          this.loginStatus = true;
          this.initEditor();
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
          this.token = value;
          checkLogin(value).then(res => {
            if (res.data.errcode == 0) {
              socket.open();
              this.user = res.data.data.user_name;
              this.user_ava = res.data.data.user_ava;
              localforage.setItem("user_ava", res.data.data.user_ava);
              socket.emit("newUser", { user: res.data.data.user_name });
              this.initData();
              this.loginStatus = true;
              this.initEditor();
            }
          });
        } else {
          this.loading = false;
        }
      });
    },

    //点击消息栏某个消息
    focusMessageItem(user_name, index) {
      this.active_chat = user_name;
      this.message = "";
      this.messageList[index].is_read = 1;
      let jsonString = JSON.stringify(this.messageList[index].message_list);
      this.messages = JSON.parse(jsonString);
      this.srcollToBottom();
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
      if (this.checkIfFriend(this.modal_active_user)) {
        socket.emit("addFriendTo", {
          from: {
            user_name: this.user,
            user_ava: this.user_ava
          },
          to: this.modal_active_user
        });
      }
    },

    //获取好友列表
    getFriendList() {
      localforage
        .getItem("token")
        .then(token => {
          return getFriendList(this.user, token);
        })
        .then(res => {
          if (res.data.errcode == 0) {
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
              this.focusMessageItem(this.messageList[i].user_name, i);
              return;
            }
          }
          //如果没有 先新增 在切换到这个人
          this.messageList.push({
            user_name: this.friendList[this.bottomNowIndex].user_name,
            message: "",
            ava: this.friendList[this.bottomNowIndex].user_ava,
            is_read: 1,
            message_list: []
          });
          this.focusMessageItem(
            this.messageList[this.messageList.length - 1].user_name,
            this.messageList.length - 1
          );
          break;
        case "delete":
          break;
      }
    },

    /**
     * 找到对应账号的人在数组中的位置
     */

    findIndexByUsername(name) {
      let len = this.messageList.length;
      for (let i = 0; i < len; i++) {
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

    handleChatMessage(data) {
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
        if (this.active_chat == data.user) {
          //如果是当前聊天
          this.messages.push(data);
          this.messageList[index].is_read = 1;
        }
      }
      this.srcollToBottom();
      this.syncToLocal();
    },
    srcollToBottom() {
      setTimeout(() => {
        let area = document.getElementsByClassName("message_show")[0];
        area.scrollTop = area.scrollHeight;
      }, 100);
    },
    addFriend() {
      this.$prompt("请输入要添加的账号", "提示").then(({ result, value }) => {
        if (result) {
          if (this.checkIfFriend(value)) {
            socket.emit("addFriendTo", {
              from: {
                user_name: this.user,
                user_ava: this.user_ava
              },
              to: value
            });
            this.$toast.success("请求已发送");
          }
        } else {
          this.$toast.message("取消操作");
        }
      });
    },
    //退出登录
    loginOut() {
      localforage.removeItem("token").then(res => {
        socket.close();
        this.$toast.success("退出登录");
        this.loginStatus = false;
        this.personnalInfoModal = false;
      });
    },
    /**
     * 打开新的朋友任务处理的弹窗
     * @param index - 数组中的位置
     */
    handleNewFriendTask(index) {
      this.active_new_friend = index;
      this.newFriendTaskModal = true;
    },
    //同意好友请求
    agreeFriendRequest() {
      addFriend({
        token: this.newFriendList[this.active_new_friend].token
      }).then(res => {
        if (res.data.errcode == 0) {
          this.newFriendList.splice(this.active_new_friend, 1);
          this.active_new_friend = null;
          this.newFriendTaskModal = false;
          this.$toast.success("好友添加成功");
          this.getFriendList(); //刷新好友列表
        } else {
          this.$toast.error("好友添加失败");
        }
      });
    },
    //拒绝好友请求
    disagreeFriendRequest() {
      socket.emit("refuseFriendRequest", {
        from: this.user,
        to: this.newFriendList[this.active_new_friend].user_name
      });
      this.newFriendList.splice(this.active_new_friend, 1);
      this.active_new_friend = null;
      this.newFriendTaskModal = false;
    },
    //检查是否已经是好友了
    checkIfFriend(name) {
      let len = this.friendList.length;
      for (let i = 0; i < len; i++) {
        if (this.friendList[i].user_name == name) {
          this.$toast.error("你们已经是好友了");
          return false;
        }
      }
      return true;
    },
    //初始化编辑器
    initEditor() {
      if (!this.editor) {
        var ed = new Editor(this.$refs.editor);
        ed.customConfig.menus = [
          "bold", // 粗体
          "fontSize", // 字号
          "fontName", // 字体
          "italic", // 斜体
          "underline", // 下划线
          "strikeThrough", // 删除线
          "foreColor", // 文字颜色
          "backColor", // 背景颜色
          "emoticon", // 表情
          "undo", // 撤销
          "redo" // 重复
        ];
        ed.customConfig.zIndex = 1;
        let _this = this;
        ed.customConfig.onchange = function(html) {
          // html 即变化之后的内容
          _this.message = html;
        };
        ed.create();
        this.editor = ed;
      }
    },
    //上传头像
    uploadAva() {
      this.$refs.file.click();
    },
    //删除好友
    deleteFriend() {
      deleteFriend(
        this.token,
        this.user,
        this.friendList[this.bottomNowIndex].user_name
      ).then(res => {
        if (res.data.errcode == 0) {
          this.$toast.success("删除成功");
          this.getFriendList();
        } else {
          this.$toast.error("删除失败");
        }
      });
      this.closeBottomSheet();
    },
    handleEditorKeyPress(e){
      if(e.key=='Enter'&&e.ctrlKey==true){
        this.submitMessage()
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "./home.less";
</style>