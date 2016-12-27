document.addEventListener ('DOMContentLoaded', function () {
	ViewEE.init(githubCORSUrl('https://github.com/sparkfun/MPU-6050_Breakout/blob/master/Hardware/Triple_Axis_Accelerometer_-_Gyro_Breakout_-_MPU-6050.brd'));
});

function githubCORSUrl (githubUrl) {
	return githubUrl
		.replace (/^https\:\/\/github\.com/, "https://cdn.rawgit.com")
		.replace (/\/blob/, "")
}
