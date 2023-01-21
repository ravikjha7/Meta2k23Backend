const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require("./db");
const User = require('./user.js');
const sendEmail = require('./email.js');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.post('/register', async (req, res) => {
    const { name, email, contact, collegeName, yearOfStudy, choice, bootedLaptops, paymentID } = req.body;

    console.log(name + " " + email + " " + contact);

    try {

        const existing = await User.findOne({ email: email });

        if (existing != null) {
            res.send({ error: "true" });
            return;
        }

        // console.log("At");

        const user = await User.create({
            name,
            email,
            contact,
            collegeName,
            yearOfStudy,
            choice,
            bootedLaptops,
            paymentID
        });

        var response = {
            error: "true"
        }

        // console.log("User" + user);

        if (user) {
            response = {
                name: user.name,
                email: user.email,
                error: "false",
                emailSent: "true"
            }

            // console.log(user);

            try {
                var message = `<p>Thanks for joining!</p><p>Save the date: Saturday, December 3rd</p><p>Join us for an offine mega event - <strong>Open Source Day</strong>, where we'll dig deeper into the two most popular technologies - Git and Bash.</p><br/><p>Thanks and Regards,<br/>Walchand Linux Users' Group.</p>`;
                console.log(message);
                sendEmail(user.email, "Thank You For Registering For Meta 2K23", message);

            } catch (err) {
                console.log(err);
                response = {
                    error: "true",
                    emailSent: "false"
                }
            }

        }

        // console.log(response);
        res.send(response);

    } catch (err) {
        var response = {
            error: "true"
        }
        // console.log("Mai Yaha Bhi Hu");
        res.send(response);
    }
})

app.post('/sendEmail', async (req, res) => {
    const users = await User.find();

    // const users = ['ravikjha7@gmail.com', 'kolapkardnyaneshwari@gmail.com', 'riteshwanave@gmail.com', 'ravikjha77@gmail.com']

    for (i = 182; i < 183; i++) {
        const email = users[i].email;
        console.log(email);
        try {
            var message = `
        <p>Hello Linux Enthusiast,  <br />
Thanks for successfully registering for our event - <strong>Open Source Day</strong><br />
As you know, the event is on the 3rd of December, 2022, consisting of a one-day workshop.</p>

<p>Inauguration ceremony<br />
Time: 9:00 AM<br />
Venue: Tilak hall, Walchand College of Engineering</p>

<p>Session 1 : <br />
Time: 10AM<br />
Venue: <strong>Mini CCF</strong></p>

<p><i>Note: Please carry your fully charged laptop with you and charger too.</i></p>

<p>Thanks and regards,<br />
Walchand Linux Users' Group</p>

<a href="https://www.instagram.com/wcewlug/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990838/1_ueuuza.png" height="50em"/></a>
<a href="https://linkedin.com/company/wlug-club" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/2_e25xxl.png" height="50em"/></a>
<a href="https://www.facebook.com/wlugclub" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/3_ew5ope.png" height="50em"/></a>
<a href="https://twitter.com/wcewlug" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/4_csegd1.png" height="50em"/></a>
<a href="http://discord.wcewlug.org/join" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990834/5_nfvomt.png" height="50em"/></a>
<a href="https://wcewlug.org/" target="_blank"><img src="https://res.cloudinary.com/ravikjha7/image/upload/v1669990835/6_onbyb0.png" height="50em"/></a>
        `;
            // console.log(message);
            sendEmail(email, "Schedule Open Source Day", message);
        } catch (err) {
            console.log(err);
        }
    }

    res.send({ "Success": true })

})

app.get('/users', async (req, res) => {
    const count = await User.find().count();
    res.send({ "No Of Users": count });
})

app.get('/allUsers', async (req, res) => {
    const users = await User.find();
    res.send({ "Users": users });
})

app.listen(port, () => {
    console.log(`Listening on Port ${port}`);
})