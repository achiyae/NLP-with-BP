//region
//Requirement:
/* The store has two types of users:
 customers who have: a name(that is their id), password,logged in status, list of coupons, shopping cart,
 their last purchases(including the price and the list of purchased items), blocked status and the messages that they received.
 admins who have: a name(that is their id), password a logged in status and the messages that they received.*/
//Output:
function customer(name, password) {
    return ctx.Entity(name, 'user', { password: password, userType: 'customer', loggedIn: false, cart: [], coupons: [], purchases: [], blocked:false, messagesReceived:[]})
}
function admin(name, password) {
    return ctx.Entity(name, 'user', { password: password, userType: 'admin', loggedIn: false, messagesReceived:[]})
}
ctx.registerQuery('User', entity => entity.type === String('user') )
ctx.registerQuery('Customer', entity => entity.type === String('user') && entity.userType === String('customer'))
ctx.registerQuery('Admin', entity => entity.type === String('user') && entity.userType === String('admin'))
//endregion

//Requirement: The store has products, each has a unique product id which is its name, cost, and quantity.
//Output:
function product(name, cost, quantity) {
    return ctx.Entity(name, 'product', { cost: cost, quantity: quantity})
}
ctx.registerQuery('Product', entity => entity.type === String('product'))

//region
//Requirement: An admin can add a new product to the store
//Output:
function addProductEvent(name, cost, quantity) {
    return Event('addProductEvent', product(name, cost, quantity))
}
ctx.registerEffect('addProductEvent', function (data) {
    ctx.insertEntity(data)
})
const AnyAddProductEvent = bp.EventSet('AnyaddProductEvent', e => e.name == 'addProductEvent')
function AnyAddProductEventWithName(name) {
    return bp.EventSet('AnyaddProductEventWithName', e => e.name == 'addProductEvent' && e.data.name == name)
}
//endregion

//Requirement: A customer can register to the store, using his name and password.
//Output:
function registerEvent(name, password) {
    return Event('registerEvent', customer(name, password))
}
ctx.registerEffect('registerEvent', function (data) {
    ctx.insertEntity(data)
})
const AnyRegisterEvent = bp.EventSet('AnyRegisterEvent', e => e.name == 'registerEvent')
function AnyRegisterEventWithName(name) {
    return bp.EventSet('AnyRegisterEventWithName', e => e.name == 'registerEvent' && e.data.name == name)
}


//region
//Requirement:Only logged-out users can log in. Login is done using only valid user id and matched passwords.
//Output:
ctx.registerQuery('LoggedOut User Context', entity => entity.type === String('user') && entity.loggedIn === false)
ctx.registerQuery('LoggedIn User Context', entity => entity.type === String('user') && entity.loggedIn === true)
function loginEvent(userId, password) {
    return Event('loginEvent', {userId: userId, password: password})
}
ctx.registerEffect('loginEvent', function (data) {
    let user = ctx.getEntityById(data.userId)
    if(user==null || user.password != data.password) return;
    user.loggedIn = true
})
const AnyLoginEvent = bp.EventSet('AnyLogin', e => e.name === 'loginEvent')
function AnyValidLoginEventWithUser(user) {
    return bp.EventSet('AnyValidLoginEventUser', e => e.name == 'loginEvent' && e.data.userId == user.id && e.data.password == user.password)
}
const AnyInvalidLogin = bp.EventSet('AnyInvalidLogin', e => {

    if(e.name != 'loginEvent') return false;
    let user =  ctx.getEntityById(e.data.userId)
    return user==null || user.password != e.data.password
})
ctx.registerEffect('loginEvent', function (data) {
    let user = ctx.getEntityById(data.userId)
    if(user==null) return;
    if(user.password != data.password) return;
    user.loggedIn = true
})
bthread("Login is done using only valid username and matched passwords.",function () {
    bp.sync({block: AnyInvalidLoginUser()})
})

ctx.bthread('only logged-out users can log in', "LoggedOut User Context", function (user) {
    bp.sync({waitFor: AnyValidLoginEventWithUser(user)})
})
ctx.bthread('only logged-out users can log in', "LoggedIn User Context", function (user) {
    bp.sync({block: AnyValidLoginEventWithUser(user)})
})

//! This might seem to similar the previous requirement, but it is not. It makes the model much better as now
//! it understands the different logged in contexts(User and Customer).
//! many tries showed that this is the best way to do it.
//endregion

//region
//Requirement: only logged in customers can add products to their cart mentioning the amount and the item
//Output:
function addToCartEvent(customer, product, amount) {
    return Event('addToCartEvent', {customerId: customer.id, productId: product.id, amount: amount})
}
ctx.registerEffect('addToCartEvent', function (data) {
    let customer = ctx.getEntityById(data.customerId)
    let product = ctx.getEntityById(data.productId)
    if(customer==null || product==null) return;
    customer.cart.push({product: product, amount: data.amount})
})
const AnyAddToCartEvent = bp.EventSet('AnyAddToCartEvent', e => e.name === 'addToCartEvent')
function AnyAddToCartEventWithCustomer(customer) {
    return bp.EventSet('AnyAddToCartEventWithCustomer', e => e.name === 'addToCartEvent' && e.data.customerId === customer.id)
}
function AnyAddToCartEventWithProduct(product) {
    return bp.EventSet('AnyAddToCartEventWithProduct', e => e.name === 'addToCartEvent' && e.data.productId === product.id)
}
ctx.registerQuery('LoggedIn Customer Context', entity => entity.type === String('customer') && entity.loggedIn === true)
ctx.registerQuery('LoggedOut Customer Context', entity => entity.type === String('customer') && entity.loggedIn === false)
ctx.bthread('Only a loggedIn customer can add products to his cart, mentioning the amount and the item', "LoggedIn Customer", function (customer) {
    bp.sync({waitFor: AnyAddToCartEventWithCustomer(customer)})
})
ctx.bthread('Only a loggedIn customer can add products to his cart, mentioning the amount and the item', "LoggedOut Customer", function (customer) {
    bp.sync({block: AnyAddToCartEventWithCustomer(customer)})
})
//endregion

//Requirement: Only logged-in users can log out of the store.
//Output:
function logoutEvent(userId) {
    return Event('logoutEvent', {userId: userId})
}
ctx.registerEffect('logoutEvent', function (data) {
    let user = ctx.getEntityById(data.userId)
    if(user==null) return;
    user.loggedIn = false
})
const AnyLogoutEvent = bp.EventSet('AnyLogoutEvent', e => e.name === 'logoutEvent')
function AnyLogoutEventWithUser(user) {
    return bp.EventSet('AnyLogoutEventWithUser', e => e.name === 'logoutEvent' && e.data.userId === user.id)
}
ctx.bthread('Only logged-in users can log out of the store.', "LoggedIn User Context", function (user) {
    bp.sync({waitFor: AnyLogoutEventWithUser(user)})
})
ctx.bthread('Only logged-in users can log out of the store.', "LoggedOut User Context", function (user) {
    bp.sync({block: AnyLogoutEventWithUser(user)})
})

//Requirement: Only logged-in admins can block a customer
//Output:
function blockCustomerEvent(adminId, customerId) {
    return Event('blockCustomerEvent', {adminId: adminId, customerId: customerId})
}
ctx.registerEffect('blockCustomerEvent', function (data) {
    let admin = ctx.getEntityById(data.adminId)
    let customer = ctx.getEntityById(data.customerId)
    if(admin==null || customer==null) return;
    customer.blocked = true
})
const AnyBlockCustomerEvent = bp.EventSet('AnyBlockCustomerEvent', e => e.name === 'blockCustomerEvent')
function AnyBlockCustomerEventWithAdmin(admin) {
    return bp.EventSet('AnyBlockCustomerEventWithAdmin', e => e.name === 'blockCustomerEvent' && e.data.adminId === admin.id)
}
ctx.registerQuery('LoggedIn Admin Context', entity => entity.type === String('admin') && entity.loggedIn === true)
ctx.registerQuery('LoggedOut Admin Context', entity => entity.type === String('admin') && entity.loggedIn === false)
ctx.bthread('Only logged-in admins can block a customer', "LoggedIn Admin Context", function (admin) {
    bp.sync({waitFor: AnyBlockCustomerEventWithAdmin(admin)})
})
ctx.bthread('Only logged-in admins can block a customer', "LoggedOut Admin Context", function (admin) {
    bp.sync({block: AnyBlockCustomerEventWithAdmin(admin)})
})

//region
//Requirement: A product cant be added to the cart in a quantity that is greater than the quantity in the store.
//Output:
ctx.bthread('A product cant be added to the cart in a quantity that is greater than the quantity in the store.', "Product", function (product) {
    bp.sync({block: bp.EventSet('AnyAddToCartProduct', e => e.name === 'addToCart' && e.data.itemId === product.id && e.data.amount > product.quantity)})
})
//endregion

//Requirement: A customer can select each product only once(in any quantity).
//Output:
ctx.bthread('A customer can select each product only once(in any quantity).', "Customer", function (customer) {
    bp.sync({block: bp.EventSet('AnyAddToCartCustomer', e => e.name === 'addToCart' && e.data.customerId === customer.id && customer.cart.filter(item => item.product.id === e.data.itemId).length > 0)})
})

//Requirement: a customer can add 5 different products to his cart at most
//Output:
ctx.bthread('a customer can add 5 different products to his cart at most', "Customer", function (customer) {
    bp.sync({block: bp.EventSet('AnyAddToCartCustomer', e => e.name === 'addToCart' && e.data.customerId === customer.id && customer.cart.length >= 5)})
})

//Requirement: Only a logged in customer can check out, this orders all the items in his cart. The customer's cart is emptied, the store's products' quantities are decreased and the purchase details(products and total price) are saved for the customer .
//Output:
function checkoutEvent(customerId) {
    return Event('checkoutEvent', {customerId: customerId})
}
ctx.registerEffect('checkoutEvent', function (data) {
    let customer = ctx.getEntityById(data.customerId)
    if(customer==null) return;
    let totalPrice = 0;
    let purchasedItems = [];
    for(let item of customer.cart){
        let product = ctx.getEntityById(item.product.id)
        if(product==null) continue;
        product.quantity -= item.amount;
        totalPrice += item.amount * product.cost;
        purchasedItems.push({product: product, amount: item.amount})
    }
    customer.purchases.push({items: purchasedItems, totalPrice: totalPrice})
    customer.cart = []
})
const AnyCheckoutEvent = bp.EventSet('AnyCheckoutEvent', e => e.name === 'checkoutEvent')
function AnyCheckoutEventWithCustomer(customer) {
    return bp.EventSet('AnyCheckoutEventWithCustomer', e => e.name === 'checkoutEvent' && e.data.customerId === customer.id)
}
ctx.bthread('Only a logged in customer can check out, this orders all the items in his cart.', "LoggedIn Customer Context", function (customer) {
    bp.sync({waitFor: AnyCheckoutEventWithCustomer(customer)})
})
ctx.bthread('Only a logged in customer can check out, this orders all the items in his cart.', "LoggedOut Customer Context", function (customer) {
    bp.sync({block: AnyCheckoutEventWithCustomer(customer)})
})
//!It didn't see any example for a combination of wait and block but still managed to do it.
//Requirement: A customer can log out only after he checked out.
//Output:
ctx.bthread('A customer can log out only after he checked out.', "LoggedIn Customer Context", function (customer) {
    bp.sync({waitFor: AnyCheckoutEventWithCustomer(customer), block: AnyLogoutEventWithUser(customer)})
})

//Requirement: The store supports sending notification to users
//Output:
function sendNotificationEvent(userId, message) {
    return Event('sendNotificationEvent', {userId: userId, message: message})
}
ctx.registerEffect('sendNotificationEvent', function (data) {
    let user = ctx.getEntityById(data.userId)
    if(user==null) return;
    user.messagesReceived.push(data.message)
})
const AnySendNotificationEvent = bp.EventSet('AnySendNotificationEvent', e => e.name === 'sendNotificationEvent')
function AnySendNotificationEventWithUser(user) {
    return bp.EventSet('AnySendNotificationEventWithUser', e => e.name === 'sendNotificationEvent' && e.data.userId === user.id)
}
//region
//Requirement: after logging in, the user receives a message "You logged in"
//Output:
ctx.bthread('after logging in, the user receives a message "You logged in"', "User", function (user) {
    bp.sync({waitFor: AnyValidLoginEventWithUser(user)})
    bp.sync({request: sendNotificationEvent(user.id, "You logged in")})
})
//endregion

//Requirement: After checkout, the customer logouts automatically
//Output:
ctx.bthread('After checkout, the customer logouts automatically', "LoggedIn Customer Context", function (customer) {
    bp.sync({waitFor: AnyCheckoutEventWithCustomer(customer)})
    bp.sync({request: logoutEvent(customer.id)})
})