const BASE_URL = "http://192.168.0.11:3580/quiz";
const app = new Vue({
  el: "#app",
  data() {
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
        120: "新人答题王",
        300: "很牛逼的称号",
        400: "无敌的存在"
      },
      currentLabel: "新人答题王",
      showLabel: false,
      showShare: false
    };
  },
  created() {
    this.initUser();
  },
  mounted() {},
  computed: {},
  methods: {
    // "openId", "userName", "nickName", "headImg"
    bindUser() {
      if (this.userName != "") {
        axios
          .post(BASE_URL + "/initUser", {
            ...this.userInfo,
            userName: this.userName
          })
          .then(data => {
            if (data.data.code == 200) {
              this.user = data.data.data.user;
              this.myRank = data.data.data.rank;
              this.topOne = data.data.data.topOne;

              if (
                data.data.data.user.userName &&
                data.data.data.user.userName != ""
              ) {
                this.user = data.data.data.user;
                this.myRank = data.data.data.rank;
                this.topOne = data.data.data.topOne;
                this.showLogin = false;
              }

              this.showLogin = false;
            } else {
              alert("网络繁忙");
            }
            console.log(data);
          });
      } else {
        alert("请先输入姓名");
      }
    },
    showShareFb() {
      this.showShare = !this.showShare;
    },
    showEndLable(oldVale, newValue) {
      console.log(oldVale, newValue);
      if (oldVale < 55 && newValue > 55) {
        this.showLable = true;
        this.currentLabel = this.labels[120];
      } else {
        this.showResult = true;
      }
    },
    showEnd() {
      console.log(this.result);
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.oldUser = this.user;
      this.isLoading = true
      axios
        .post(BASE_URL + "/updateRecord", {
          userId: this.user._id,
          ...this.result
        })
        .then(data => {
          this.isLoading = false;
          if (data.data.code == 200) {
            this.user=data.data.data
            this.showEndLable(this.oldUser.point, data.data.data.point);
            console.log(data.data.data);
          } else {
            alert("网络繁忙");
          }
          console.log(data);
        });
    },
    initProblem() {
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
      setTimeout(() => {
        this.doDownTime();
      }, 500);
    },
    showCorrect(index) {
      this.problemData.ok_index = index;
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.result.cids.push(this.problemData.cproblem._id);
      setTimeout(() => {
        this.problemData.ok_index = -1;
        this.problemData.err_index = -1;
        this.problemData.isShowProblem = false;
        setTimeout(() => {
          this.initProblem();
        }, 500);
      }, 500);
    },
    showError(index) {
      this.result.eids.push(this.problemData.cproblem._id);
      this.problemData.err_index = index;
      this.problemData.ok_index = -1;
      setTimeout(() => {
        this.showExplain = true;
      }, 500);
    },
    choseItem(item, index) {
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
    doNext() {
      this.showExplain = false;
      this.problemData.ok_index = -1;
      this.problemData.err_index = -1;
      this.problemData.isShowProblem = false;
      setTimeout(() => {
        this.initProblem();
      }, 500);
    },
    autoNext() {
      if (!this.isCanAnswer) {
        return false;
      }
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.isCanAnswer = false;
      // todo
      this.showError(-1);
    },

    restart() {
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
    gohome() {
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.showLable = false;
      this.currentLabel = this.labels[120];
      this.problemData.timer && clearInterval(this.problemData.timer);
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
    doDownTime() {
      this.problemData.timer && clearInterval(this.problemData.timer);
      this.problemData.downTime = 10;
      this.problemData.timer = setInterval(() => {
        console.log(this.problemData.downTime);
        this.problemData.downTime -= 1;
        if (this.problemData.downTime <= 0) {
          clearInterval(this.problemData.timer);
          this.autoNext();
        }
      }, 1000);
    },
    goEnter() {
      this.currentPage = 2;
      this.isLoading = true
      axios
        .post(BASE_URL + "/fetchProblems", { userId: this.user._id })
        .then(data => {
          this.isLoading = false
          this.isLoading = false;
          if (data.data.code == 200) {
            console.log(data.data.data);
            this.problemData = {
              currentOrder: -1,
              problems: data.data.data,
              cproblem: data.data.data[0],
              ok_index: -1,
              err_index: -1,
              timer: null,
              downTime: 10,
              isShowProblem: false
            };
            this.initProblem();
          } else {
            alert("网络繁忙");
          }
          console.log(data);
        });
    },
    seeRank() {
      this.currentPage = 3;
      axios.post(BASE_URL + "/fetchRank", {}).then(data => {
        this.isLoading = false;
        if (data.data.code == 200) {
          this.ranks = data.data.data;
          console.log(data.data.data);
        } else {
          alert("网络繁忙");
        }
        console.log(data);
      });
    },
    initUser() {
      this.isLoading = true;
      axios.post(BASE_URL + "/initUser", this.userInfo).then(data => {
        this.isLoading = false;
        if (data.data.code == 200) {
          if (
            data.data.data.user.userName &&
            data.data.data.user.userName != ""
          ) {
            this.user = data.data.data.user;
            this.myRank = data.data.data.rank;
            this.topOne = data.data.data.topOne;
          } else {
            this.showLogin = true;
          }
        } else {
          alert("网络繁忙");
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
