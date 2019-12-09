const mongoose = require('mongoose');
const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');
const Survey = mongoose.model('surveys');

module.exports = (app) => {
    app.get('/api/surveys/:surveyId/:choice', (request, response) => {
        response.send("Thanks for the feedback");
    });

    app.post('/api/surveys/webhooks',(request, response) => {
        //console.log(request.body);
        const parser = new Path('/api/surveys/:surveyId/:choice');

        _.chain(request.body)
        .map(({email, url}) => { 
            const match = parser.test(new URL(url).pathname);
            if (match){
                return {email, surveyId: match.surveyId, choice: match.choice};
            }
        })
        .compact()
        .uniqBy('email', 'surveyId')
        .each(({ surveyId, email, choice}) => {
            console.log("Before Update one method!");
            Survey.updateOne(
                {
                    _id: surveyId,
                    recipients: {
                        $elemMatch: { email:email, responsded: false }
                    }
                },
                {
                    $inc: { [choice]: 1 },
                    $set: { 'recipients.$.responded': true },
                    lastResponded: new Date()
                }
            ).exec();
            console.log("ending Update one method!");
        })
        .value();
        
        response.send({});
    });

    app.post('/api/surveys',requireLogin , requireCredits, async (request, response) => {
        const { title, subject, body, recipients } = request.body;
        const survey = new Survey({
            title,
            subject,
            body,
            recipients: recipients.split(',').map( email => ({ email: email.trim() })),
            _user: request.user.id,
            dateSent: Date.now()
        });
        //Great place to send an email!
        const mailer = new Mailer(survey, surveyTemplate(survey));
        
        try{
        await mailer.send();
        await survey.save();
        request.user.credits -= 1;
        const user = await request.user.save();
        
        response.send(user);
        }catch(err) {
            response.status(422).send(err); 
        }
    });
};