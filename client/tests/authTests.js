QUnit.test("click to register button hides the login screen and presents the registration form", function (assert) {
	// setup all the necesary variables
	var registerFormBtn = $('#register-form-btn');
	var loginForm = $('#login-form');
	var registerForm = $('#register-form');
	// trigger register form button to switch between login and register
	registerFormBtn.trigger('click');
	// test if the button changed between the login screen and register screen
	assert.ok(loginForm.hasClass('hidden'), "Login form is hidden");
	assert.notOk(registerForm.hasClass('hidden'), "Register form is visible");
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
	assert.step("both input fields are empty");
	// test if it is disabled
	assert.ok(registerUserBtn.is(':disabled'), "Register user button is disabled");
	// enter a value only in the username field
	usernameRegisterInput.value = 'test';
	passwordRegisterInput.value = '';
	// notify all the observers that a value has been added
	if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
		fieldObserver.notify('enable');
	} else {
		fieldObserver.notify('disable');
	}
	assert.step("password input field is empty");
	// test if it is still disabled because the password field is still empty
	assert.ok(registerUserBtn.is(':disabled'), "Register user button is disabled");
	// enter a value only in the password field
	passwordRegisterInput.value = 'test';
	usernameRegisterInput.value = '';
	// notify all the observers that a value has been added
	if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
		fieldObserver.notify('enable');
	} else {
		fieldObserver.notify('disable');
	}
	assert.step("username input field is empty");
	// test if it is still disabled because the username field is still empty
	assert.ok(registerUserBtn.is(':disabled'), "Register user button is disabled");
	// enter a values in the username and password field
	passwordRegisterInput.value = 'test';
	usernameRegisterInput.value = 'test';
	// notify all the observers that values have been added
	if (usernameRegisterInput.value !== '' && passwordRegisterInput.value !== '') {
		fieldObserver.notify('enable');
	} else {
		fieldObserver.notify('disable');
	}
	assert.step("both input fields have values now");
	// test if it is enabled because the username and password field now both have values in them
	assert.ok(registerUserBtn.is(':enabled'), "Register user button is enabled");
	// set the pages state back to how it was
	usernameRegisterInput.value = '';
	passwordRegisterInput.value = '';
	registerForm[0].classList.add('hidden');
	loginForm[0].classList.remove('hidden');
})

QUnit.test("upon entering a username and a password the register button hides the registration form and presents the login screen once again", function (assert) {
	// setup all the necesary variables
	var registerUserBtn = $('#register-btn');
	var registerForm = $('#register-form');
	var loginForm = $('#login-form');
	// trigger register form button to switch between login and register
	registerUserBtn.trigger('click');
	// test if the button changed between the login screen and register screen
	assert.ok(registerForm.hasClass('hidden'), "Register form is hidden");
	assert.notOk(loginForm.hasClass('hidden'), "Login form is visible");
	// set the pages state back to how it was
	registerForm[0].classList.add('hidden');
	loginForm[0].classList.remove('hidden');
})