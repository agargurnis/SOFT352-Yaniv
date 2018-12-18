QUnit.test("click to register button hides the login screen and presents the registration form", function (assert) {
	// setup all the necesary variables
	var registerFormBtn = $('#register-form-btn');
	var loginForm = $('#login-form');
	var registerForm = $('#register-form');
	// trigger register form button to switch between login and register
	registerFormBtn.trigger('click');
	// test if the button changed between the login screen and register screen
	assert.ok(loginForm.hasClass('hidden'), true, "It has the class");
	assert.notOk(registerForm.hasClass('hidden'), true, "It does not have the class");
	// set the pages state back to how it was
	registerForm[0].classList.add('hidden');
	loginForm[0].classList.remove('hidden');
})

QUnit.test("the register user button is not enabled until the username and password field has a value", function (assert) {
	// setup all the necesary variables
	var registerFormBtn = $('#register-form-btn');
	var registerUserBtn = $('#register-btn');
	const fieldObserver = new Observable();
	var loginForm = $('#login-form');
	var registerForm = $('#register-form');
	var usernameRegisterInput = $('#username-register-input')[0];
	var passwordRegisterInput = $('#password-register-input')[0];
	// subscribe to the observer pattern
	fieldObserver.subscribe(registerUserBtn[0]);
	// trigger register form button to switch between login and register
	registerFormBtn.trigger('click');
	// trigger register user buttpm to check if its disabled whilst the username and password field is empty
	registerUserBtn.trigger('click');
	// test if it is disabled
	assert.ok(registerUserBtn.is(':disabled'), true, "It is disabled");
	// enter a value only in the username field
	usernameRegisterInput.value = 'test';
	passwordRegisterInput.value = '';
	// notify all the observers that a value has been added
	if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
		fieldObserver.notify('enable');
	} else {
		fieldObserver.notify('disable');
	}
	// test if it is still disabled because the password field is still empty
	assert.ok(registerUserBtn.is(':disabled'), true, "It is disabled");
	// enter a value only in the password field
	passwordRegisterInput.value = 'test';
	usernameRegisterInput.value = '';
	// notify all the observers that a value has been added
	if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
		fieldObserver.notify('enable');
	} else {
		fieldObserver.notify('disable');
	}
	// test if it is still disabled because the username field is still empty
	assert.ok(registerUserBtn.is(':disabled'), true, "It is disabled");
	// enter a values in the username and password field
	passwordRegisterInput.value = 'test';
	usernameRegisterInput.value = 'test';
	// notify all the observers that values have been added
	if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
		fieldObserver.notify('enable');
	} else {
		fieldObserver.notify('disable');
	}
	// test if it is enabled because the username and password field now both have values in them
	assert.ok(registerUserBtn.is(':enabled'), true, "It is enabled");
	// set the pages state back to how it was
	usernameRegisterInput.value = '';
	passwordRegisterInput.value = '';
	registerForm[0].classList.add('hidden');
	loginForm[0].classList.remove('hidden');
})

// QUnit.test("upon entering a username and a password the register button hides the registration form and presents the login screen", function (assert) {
// 	var registerUserBtn = $('#register-btn');
// 	var registerForm = $('#register-form');
// 	registerUserBtn.trigger('click');
// 	assert.ok(registerForm.hasClass('hidden'), true, "It has the class!");
// })