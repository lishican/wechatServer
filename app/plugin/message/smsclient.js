/**
 * 云通信基础能力业务短信发送、查询详情以及消费消息示例，供参考。
 * Created on 2017-07-31
 */
const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'yourAccessKeyId'
const secretAccessKey = 'yourAccessKeySecret'
//在云通信页面开通相应业务消息后，就能在页面上获得对应的queueName,不用填最后面一段
const queueName = 'Alicom-Queue-1092397003988387-'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
smsClient.sendBatchSMS({
    PhoneNumberJson: JSON.stringify(['18040580000', '15088650000']),
    SignNameJson: JSON.stringify(['短信迁移测试签名','短信迁移测试签名']),
    TemplateCode: 'SMS_71175823',
    TemplateParamJson: JSON.stringify([{code: "1234", product: "ytx1"}, {code: "5678", product: "ytx2"}]),
}).then(function (res) {
    let {Code}=res
    if (Code === 'OK') {
       //处理返回参数
       console.log(res)
    }
}, function (err) {
    console.log('err', err)
})
// LTAIo1wBpg9TozEa  id
// MPKL66z1TaBhIfTo5NOH7NBTtAED14  key


/* const SMSClient = require('@alicloud/sms-sdk')
// ACCESS_KEY_ID/ACCESS_KEY_SECRET 根据实际申请的账号信息进行替换
const accessKeyId = 'yourAccessKeyId'
const secretAccessKey = 'yourAccessKeySecret'
//初始化sms_client
let smsClient = new SMSClient({accessKeyId, secretAccessKey})
//发送短信
smsClient.sendSMS({
    PhoneNumbers: '1500000000',
    SignName: '云通信产品',
    TemplateCode: 'SMS_000000',
    TemplateParam: '{"code":"12345"}'
}).then(function (res) {
    let {Code}=res
    if (Code === 'OK') {
        //处理返回参数
        console.log(res)
    }
}, function (err) {
    console.log(err)
}) */


// OK	请求成功
// isp.RAM_PERMISSION_DENY	RAM权限DENY
// isv.OUT_OF_SERVICE	业务停机
// isv.PRODUCT_UN_SUBSCRIPT	未开通云通信产品的阿里云客户
// isv.PRODUCT_UNSUBSCRIBE	产品未开通
// isv.ACCOUNT_NOT_EXISTS	账户不存在
// isv.ACCOUNT_ABNORMAL	账户异常
// isv.SMS_TEMPLATE_ILLEGAL	短信模板不合法
// isv.SMS_SIGNATURE_ILLEGAL	短信签名不合法
// isv.INVALID_PARAMETERS	参数异常
// isp.SYSTEM_ERROR	系统错误
// isv.MOBILE_NUMBER_ILLEGAL	非法手机号
// isv.MOBILE_COUNT_OVER_LIMIT	手机号码数量超过限制
// isv.TEMPLATE_MISSING_PARAMETERS	模板缺少变量
// isv.BUSINESS_LIMIT_CONTROL	业务限流
// isv.INVALID_JSON_PARAM	JSON参数不合法，只接受字符串值
// isv.BLACK_KEY_CONTROL_LIMIT	黑名单管控
// isv.PARAM_LENGTH_LIMIT	参数超出长度限制
// isv.PARAM_NOT_SUPPORT_URL	不支持URL
// isv.AMOUNT_NOT_ENOUGH	账户余额不足