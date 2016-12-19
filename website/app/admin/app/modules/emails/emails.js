angular.module('modules.emails', [
    'angular-medium-editor'
]);
angular.module('modules.emails').

directive('recentEmails', function () {
    return {
        restrict: 'E',
        scope: {
            parentId: '@'
        },
        templateUrl: 'app/modules/emails/tpls/recent-emails.html',
        controller: function ($scope, HttpQuery, CoreLibrary) {
            $scope.query = HttpQuery({
                url: 'api/v1/emails',
                params: {
                    criteria: {
                        recipient: $scope.parentId
                    }
                },
                onSuccess: function (response) {
                    _.forEach(response, function (item) {
                        item.created = CoreLibrary.getDateFromId(item._id)
                    })
                    return response;
                }
            })
            $scope.query.more();
        }
    }
}).


service('EmailService', function ($http, $mdToast, $mdDialog, Authentication, EmailTemplates) {

    this.sendEmail = sendEmail;
    this.composeEmail = composeEmail;

    ////////////////////////////////

    function composeEmail(event, data) {
        return $mdDialog.show({
            templateUrl: 'app/modules/emails/tpls/compose-email-modal.html',
            controller: function (data, $scope) {
                var sender = Authentication.userData;
                var recipient = angular.copy(data.recipient);

                $scope.email = {
                    sender     : {
                        _id    : sender._id,
                        name   : sender.name,
                        email  : sender.email,
                    },
                    recipient : {
                        _id    : recipient._id,
                        name   : recipient.name,
                        email  : recipient.profile.email,
                    },
                    message : {
                        html    : '',
                        subject : '',
                        type    : ''
                    }
                }

                $scope.templates = EmailTemplates.get();

                $scope.messageType = {
                    model: '',
                    onChange: function () {
                        var template = _.find($scope.templates, 'name', $scope.messageType.model).getTemplate(recipient);
                        $scope.email.message = {
                            type : $scope.messageType.model,
                        }
                        _.extend($scope.email.message, template);
                    }
                }

                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.save = function () {
                    if ($scope.email.message.html && $scope.email.message.html.length > 10) {
                        $mdDialog.hide($scope.email);
                    }
                };
            },
            targetEvent: event,
            locals: {
                data: data
            }
        })
    }

    function sendEmail(data) {
        /************************************
        data = {
            sender     : {
                _id    : sender._id,
                name   : sender.name,
                email  : sender.email,
            },
            recipient : {
                _id    : recipient._id,
                name   : recipient.name,
                email  : recipient.email,
            },
            message : {
                html    : '',
                subject : '',
                type    : ''
            }
        }
        ************************************/
        return $http({
            method: 'POST',
            url: 'api/v1/emails/sendEmail',
            data: data
        })
    }
}).

service('EmailTemplates', function ($http, $mdToast, $mdDialog, Authentication) {

    var sender = Authentication.userData;

    var calendlyUrl, calendyUrlData = {
        'Jackson Delahunt' : 'https://calendly.com/stemn-jackson/15min',
        'Jack Yeh'         : 'https://calendly.com/jackyeh/30min',
        'Denzil Khan'      : 'https://calendly.com/denzil/30min',
    }

    // Set Calendy URL
    calendlyUrl = calendyUrlData[sender.name] || calendyUrlData['Jack Yeh'];

    this.get = get;

    ////////////////////////////////////////

    function get() {
        return [{
            name: 'Job Application - More work needed',
            getTemplate: function (recipient) {
                return {
                    subject: `Your STEMN job application is getting close...`,
                    html: `
                        Hi ${recipient.profile.firstname},<br><br>
                        Our team has personally reviewed your applications, and we've decided we aren't able to send them through, <b>yet</b>.<br><br>
                        Your candidacy looks good on paper, and you would rank among the top 10 percentile for some roles. However we found the quality and content of your projects to be insufficient for what our partner companies are expecting.<br><br>
                        Our partner companies require your technical, problem solving, and communication skills to be demonstrated through your projects, but your projects aren't quite there yet. Your projects should be structured according to the scientific method. It doesn't need to be as formal as a journal paper, but it does need to show your methodical approach to technical problems. Here are two good examples:<br><br>
                        <a href="https://stemn.com/projects/holonomic-robot?ref=a7d1d8">Holonomic Robot</a><br>
                        <a href="https://stemn.com/projects/interactive-data-glove-for-american-sign-language?ref=e1a6fe">Interactive Data Glove for American Sign Language</a><br><br>
                        You can also read our guide on <a href="https://stemn.com/blogs/how-to-create-a-compelling-project-that-gets-you-hired?ref=a7d372">how to create a compelling project that gets you hired.</a><br><br>
                        A standout application will take time to craft. If you’re serious about your career, we’re serious about doing everything we can to help you get there. How long do you think you’ll need?<br><br>
                        Reply to this email with a date, and we’ll set aside a time to review your application with you over Skype and get it sent!<br><br>
                        Let me know if you have any questions - I'm always happy to help.<br><br>
                        Speak soon,<br>
                        ${sender.name}<br>
                        Co-Founder, STEMN
                    `
                }
            }
        }, {
            name: 'Job Application - Setup meeting',
            getTemplate: function (recipient) {
                return {
                    subject: `Time to talk about your STEMN job applications!`,
                    html: `
                        Hey ${recipient.profile.firstname},<br><br>
                        Our team has personally reviewed your application, and we'd like to schedule a Skype call to give you feedback on how you can improve your portfolio before we send it through.<br><br>
                        During this session, we'll be reviewing your portfolio with you from a hiring manager's perspective. We know exactly what the hiring managers are looking for, and we'll help you shape your portfolio to blow them away.<br><br>
                        In addition, we'll also share particular insights about what specific companies are looking for, and, it'll give you an opportunity to sharpen those interviewing skills.<br><br>
                        Are you available to chat in the next day or two? If so, here's my current availability. If those times don't work, let me know - we'll try schedule something at a time of your convenience.<br><br>
                        <a href="${calendlyUrl}">${calendlyUrl}</a><br><br>
                        Thanks,<br>
                        ${sender.name}<br>
                        Co-Founder, STEMN
                    `
                }
            }
        }, {
            name: 'Job Application - Meeting Notes',
            getTemplate: function (recipient) {
                return {
                    subject: `My notes from our Skype call`,
                    html: `
                    Hey ${recipient.profile.firstname},<br><br>
                    I went back over your profile and made some notes. I also thought I'd include some of the points from our call for your reference.<br><br>
                    On your STEMN profile page, the blurb under your name should contain your defining unique quality. What do you feel you posses that other's don't? Put that there.<br><br>
                    In the My Education section, list all of the courses you completed as part of your degree. Everybody's course specializations are different, so use this as a chance to convey your educational experience.<br><br>
                    The Skills and Knowledge section can be populated manually. However the skills with numbers are populated from your projects. This gives companies a chance to see how you demonstrated a skill in practice. I highly recommend adding as many relevant tags to your projects as possible. Finally, make sure to categorize these skills on your profile page into Skills and Technologies.<br><br>
                    As mentioned, the average number of projects each applicant has is two. To stand out, try to make this number four or five. As soon as employers see more content, they are more impressed - it's only natural to be impressed by a larger body of work.<br><br>
                    Lastly, and most importantly, the cover letter to each company should be mostly about the company. Do your research on the company, learn about their technology, where they've been, and where they're going. Search for interviews and press releases, watch YouTube videos, find anything you can. Then, use this to inform your cover letter and talk about why they inspire you, and what working with them would mean to you, relating your skills and aspirations to their work. This is possibly the single most important part of your application. Personally, I believe companies impressions are weighted 60/40 cover letter/portfolio. This will also bode well for you in the interview when you are informed about the company.<br><br>
                    Do all of those things, and you'll blow them away. I promise.<br><br>
                    After you finish your updates, reply to this email and I'll review your changes and we can progress to the next stage.<br><br>
                    We're looking forward to taking your portfolio to our contacts at these companies, and we'll put in our absolute best to try and get you one of the jobs you applied to.<br><br>
                    Talk soon,<br><br>
                    ${sender.name}<br>
                    Co-Founder, STEMN
                `
                }
            }
        }, {
            name: 'Generic Email',
            getTemplate: function (recipient) {
                return {
                    subject: ``,
                    html: `
                    Hey ${recipient.profile.firstname},<br><br>
                    Message.<br><br>
                    ${sender.name}<br>
                    Co-Founder, STEMN
                `
                }
            }
        }]
    }
});
