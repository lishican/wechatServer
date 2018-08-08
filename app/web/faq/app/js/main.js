"use strict";

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

// var BASE_URL = "http://192.168.0.11:3580/quiz";
var BASE_URL = "https://game2.stackh.cn/quiz";
var app = new Vue({
  el: "#app",
  data: function data() {
    return {
      msg: "hello word",
      currentPage: 1,
      isLoading: false,
      showLogin: false,
      userName: "",
      userInfo: {
        openId: document.getElementById("openId").value,
        nickName: document.getElementById("nickName").value,
        headImg: document.getElementById("headImg").value
      },
      showExplain: false,
      user: {},
      topOne: {},
      myRank: 0,
      ranks: [],
      problemData: {
        currentOrder: -1,
        problems: [],
        ok_index: -1,
        err_index: -1,
        timer: null,
        downTime: 10,
        isShowProblem: false
      },
      result: {
        cids: [],
        eids: []
      },
      oldUser: {},
      showResult: false,
      isCanAnswer: false,
      labels: {
        10: "小试牛刀",
        20: "闯关达人",
        30: "最强王者",
        40: "百科全书"
      },
      currentLabel: "新人答题王",
      showLabel: false,
      showShare: false
    };
  },
  created: function created() {
    this.initUser();
  },
  mounted: function mounted() {},

  computed: {},
  methods: {
    // "openId", "userName", "nickName", "headImg"
    bindUser: function bindUser() {
      var _this = this;

      if (this.userName != "") {
        axios
          .post(
            BASE_URL + "/initUser",
            _extends({}, this.userInfo, {
              userName: this.userName
            })
          )
          .then(function(data) {
            if (data.data.code == 200) {
              _this.user = data.data.data.user;
              _this.myRank = data.data.data.rank;
              _this.topOne = data.data.data.topOne;

              if (
                data.data.data.user.userName &&
                data.data.data.user.userName != ""
              ) {
                _this.user = data.data.data.user;
                _this.myRank = data.data.data.rank;
                _this.topOne = data.data.data.topOne;
                _this.showLogin = false;
              }

              _this.showLogin = false;
            } else {
              alert(data.data.msg);
            }
            console.log(data);
          });
      } else {
        alert("请先输入姓名");
      }
    },
    showShareFb: function showShareFb() {
      this.showShare = !this.showShare;
    },

    showEndLable: function showEndLable(oldVale, newValue) {
      console.log(oldVale, newValue);
      if (oldVale < 10 && newValue >= 10) {
        this.showLabel = true;
        this.currentLabel = this.labels[10];
      } else if (oldVale < 20 && newValue >= 20) {
        this.showLabel = true;
        this.currentLabel = this.labels[20];
      } else if (oldVale < 30 && newValue >= 30) {
        this.showLabel = true;
        this.currentLabel = this.labels[30];
      } else if (oldVale < 40 && newValue >= 40) {
        this.showLabel = true;
        this.currentLabel = this.labels[30];
      } else {
        this.showResult = true;
      }
    },
    showEnd: function showEnd() {
      var _this2 = this;

      console.log(this.result);
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.oldUser = this.user;
      this.isLoading = true;
      axios
        .post(
          BASE_URL + "/updateRecord",
          _extends(
            {
              userId: this.user._id
            },
            this.result
          )
        )
        .then(function(data) {
          _this2.isLoading = false;
          if (data.data.code == 200) {
            _this2.user = data.data.data;
            _this2.showEndLable(_this2.oldUser.point, data.data.data.point);
            console.log(data.data.data);
          } else {
            alert("网络繁忙");
          }
          console.log(data);
        });
    },
    initProblem: function initProblem() {
      var _this3 = this;

      this.isCanAnswer = true;
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.problemData.currentOrder += 1;
      if (this.problemData.currentOrder >= this.problemData.problems.length) {
        this.showEnd();
        return false;
      }
      this.problemData.cproblem = this.problemData.problems[
        this.problemData.currentOrder
      ];
      this.problemData.isShowProblem = true;
      setTimeout(function() {
        _this3.doDownTime();
      }, 500);

     
    },
    showCorrect: function showCorrect(index) {
      var _this4 = this;

      this.problemData.ok_index = index;
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.result.cids.push(this.problemData.cproblem._id);
      setTimeout(function() {
        _this4.problemData.ok_index = -1;
        _this4.problemData.err_index = -1;
        _this4.problemData.isShowProblem = false;
        setTimeout(function() {
          _this4.problemData.downTime = parseInt(
            _this4.problemData.cproblem.time
          );
          _this4.initProblem();
        }, 500);
      }, 700);
    },
    showError: function showError(index) {
      var _this5 = this;

      this.result.eids.push(this.problemData.cproblem._id);
      this.problemData.err_index = index;
      this.problemData.ok_index = -1;
      setTimeout(function() {
        _this5.problemData.downTime = parseInt(
          _this5.problemData.cproblem.time
        );
        _this5.showExplain = true;
      }, 500);
    },
    choseItem: function choseItem(item, index) {
      if (!this.isCanAnswer) {
        return false;
      }
      this.isCanAnswer = false;
      console.log(item);
      this.problemData.timer && clearInterval(this.problemData.timer);
      if (this.problemData.cproblem.correctAnswer == item) {
        this.showCorrect(index);
      } else {
        this.showError(index);
      }
    },
    doNext: function doNext() {
      var _this6 = this;
      this.problemData.downTime = parseInt(this.problemData.cproblem.time);
      this.showExplain = false;
      this.problemData.ok_index = -1;
      this.problemData.err_index = -1;
      this.problemData.isShowProblem = false;
      setTimeout(function() {
        _this6.initProblem();
      }, 500);
    },
    autoNext: function autoNext() {
      if (!this.isCanAnswer) {
        return false;
      }
      this.problemData.downTime = parseInt(this.problemData.cproblem.time);
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.isCanAnswer = false;
      // todo
      this.showError(-1);
    },
    restart: function restart() {
      this.problemData.downTime = parseInt(this.problemData.cproblem.time);
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.showResult = false;
      this.problemData = {
        currentOrder: -1,
        problems: [],
        ok_index: -1,
        err_index: -1,
        timer: null,
        downTime: 10,
        isShowProblem: false
      };
      this.result = {
        eids: [],
        cids: []
      };
      this.goEnter();
    },
    gohome: function gohome() {
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.showLabel = false;
      this.currentLabel = this.labels[120];
      this.showResult = false;
      this.currentPage = 1;
      this.problemData = {
        currentOrder: -1,
        problems: [],
        ok_index: -1,
        err_index: -1,
        timer: null,
        downTime: 10,
        isShowProblem: false
      };
      this.result = {
        eids: [],
        cids: []
      };
    },
    doDownTime: function doDownTime() {
      var _this7 = this;

      this.problemData.timer && clearInterval(this.problemData.timer);
      this.problemData.downTime = parseInt(this.problemData.cproblem.time);
      this.problemData.timer = setInterval(function() {
        console.log(_this7.problemData.downTime);
        _this7.problemData.downTime -= 1;
        if (_this7.problemData.downTime <= 0) {
          clearInterval(_this7.problemData.timer);
          _this7.autoNext();
        }
      }, 1000);
    },
    goEnter: function goEnter() {
      var _this8 = this;

      this.currentPage = 2;
      this.isLoading = true;
      axios
        .post(BASE_URL + "/fetchProblems", { userId: this.user._id })
        .then(function(data) {
          _this8.isLoading = false;
          _this8.isLoading = false;
          if (data.data.code == 200) {
            console.log(data.data.data);
            _this8.problemData = {
              currentOrder: -1,
              problems: data.data.data,
              cproblem: data.data.data[0],
              ok_index: -1,
              err_index: -1,
              timer: null,
              downTime: 10,
              isShowProblem: false
            };
            _this8.initProblem();
          } else {
            alert("网络繁忙");
          }
          console.log(data);
        });
    },
    seeRank: function seeRank() {
      var _this9 = this;
      this.currentPage = 3;
      this.initUser();
      axios.post(BASE_URL + "/fetchRank", {}).then(function(data) {
        _this9.isLoading = false;
        if (data.data.code == 200) {
          _this9.ranks = data.data.data;
          console.log(data.data.data);
        } else {
          alert("网络繁忙");
        }
        console.log(data);
      });
    },
    initUser: function initUser() {
      var _this10 = this;

      this.isLoading = true;
      axios.post(BASE_URL + "/initUser", this.userInfo).then(function(data) {
        _this10.isLoading = false;
        if (data.data.code == 200) {
          if (
            data.data.data.user.userName &&
            data.data.data.user.userName != ""
          ) {
            _this10.user = data.data.data.user;
            _this10.myRank = data.data.data.rank;
            _this10.topOne = data.data.data.topOne;
          } else {
            _this10.showLogin = true;
          }
        } else {
          alert(data.data.msg);
        }
        console.log(data);
      });
    }
  }
});
// .stop
// .prevent
// .capture
// .self
// .once
// .passive
