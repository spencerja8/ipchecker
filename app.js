(function(){
    var num = 1;
    const publicIp = require('public-ip');
    const nodemailer = require("nodemailer");
    const prompt = require('prompt');
    let currentIp;
    let newIp;
    let emailAddress;
    let emailPassword;
    let fromAddress;
    let toAddress;

    var schema = {
        properties: {
          email: {
            type: 'string',
            required: true
          },
          password: {
            hidden: true,
            replace: '*',
            required: true
          },
          fromAddress: {
            description: 'Enter "From" address',
            required: true
          },
          toAddress: {
            description: 'Enter "To" address (seperate multiple entires with ", "',
            required: true
          }
        }
      };

      function beginEmailer(){

        prompt.start();

        prompt.get(schema, function (err, result) {
          emailAddress = result.email;
          emailPassword = result.password;
          fromAddress = result.fromAddress;
          toAddress = result.toAddress;
  
          //makeMail().catch(console.error);
          timer();
        });
      };

      async function makeMail() {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: emailAddress,
              pass: emailPassword
            }
          });

        let info = await transporter.sendMail({
            from: fromAddress, // sender address
            to: toAddress, // list of receivers
            subject: "Your Current IP", // Subject line
            text: "Your Current IP address is: "+currentIp, // plain text body
            html: "<b>Your Current IP address is: </b>"+currentIp // html body
          });
          //console.log(info);
      }

    async function timer(){
        
        console.log(num);
        num++;
        newIp = await publicIp.v4();
        if(newIp != currentIp)
        {
            console.log("NO: "+currentIp);
            currentIp = newIp;
            console.log("current IP has updated to: "+currentIp);
            makeMail().catch(console.error);
        }
        console.log(currentIp);

        setTimeout(timer, 10000);
    };
    //timer();
    beginEmailer();

})();