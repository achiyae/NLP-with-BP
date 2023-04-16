/* Each product has: id, type, color, and size */
let products = [
  ctx.Entity('1', 'product', { color: 'red', size: 'small' }),
  ctx.Entity('2', 'product', { color: 'red', size: 'medium' }),
  ctx.Entity('3', 'product', { color: 'red', size: 'large' }),
  ctx.Entity('4', 'product', { color: 'blue', size: 'small' }),
  ctx.Entity('5', 'product', { color: 'blue', size: 'medium' }),
  ctx.Entity('6', 'product', { color: 'blue', size: 'large' })
]
ctx.populateContext(products)
ctx.registerQuery('Product', entity => entity.type == String('product'))
ctx.registerEffect('addProduct', function (data) {
  ctx.insertEntity(ctx.Entity(data.id, 'product', { color: data.color, size: data.size }))
})

/* A user has a name, role (admin or customer), address and a list of products that are in the user's cart */
ctx.registerQuery('User', entity => entity.type == String('user'))
ctx.registerEffect('addUser', function (data) {
  ctx.insertEntity(ctx.Entity(data.id, 'user', { name: data.name, role:data.role, address: data.address, cart: [] }))
})

/* A user can place products in the cart */
function addToCart(user, product) {
  return Event('addToCart', { user: user.id, product: product.id })
}

ctx.registerEffect('addToCart', function (e) {
  let user = ctx.getEntityById(e.user)
  user.cart.push(e.product)
})
const AnyAddToCart = bp.EventSet('AnyAddToCart', e => e.name == 'addToCart')

function AnyAddToCartUser(user) {
  bp.EventSet('AnyAddToCartUser', e => e.name == 'addToCart' && e.data.user == user.id)
}

function AnyAddToCartProduct(product) {
  return bp.EventSet('AnyAddToCartProduct', e => e.name == 'addToCart' && e.data.product == product.id)
}

ctx.bthread('A user can place products in the cart', ['User', 'Product'], function (user, product) {
  sync({ request: addToCart(user, product) })
})


/* The user adds three products to the cart and then checkouts */
function checkout(user) {
  return Event('checkout', { user: user.id })
}

const AnyCheckout = bp.EventSet('AnyCheckout', e => e.name == 'checkout')
const AnyCheckoutUser = user => bp.EventSet('AnyCheckoutUser', e => e.name == 'checkout' && e.data.user == user.id)
ctx.bthread('The user places three products to the cart and then checkouts', 'User', function (user) {
  let products = ctx.runQuery('Product')
  for (let i = 0; i < 3; i++) {
    sync({ request: addToCart(user, choose(products)) })
  }
  sync({ request: checkout(user) })
})

/* Whenever a user checkouts, verify that the products on screen are the same as the products that are in his cart */
function verifyCheckoutProducts(user) {
  return Event('verifyCheckoutProducts', { user: user.id })
}
ctx.bthread('Whenever a user checkouts, verify that the correct products are in his cart', 'User', function (user) {
  while (true) {
    sync({ waitFor: AnyCheckoutUser(user) })
    sync({ request: verifyCheckoutProducts(user) })
  }
})

/* An admin can give products a discount of 10%, 25%, or 50% */
ctx.registerQuery('User.admin', entity => entity.type == String('user') && entity.role=='admin')
function discount(admin, product, percentage) {
  bp.ASSERT(admin.role=='admin', "discount was called with a non-admin user")
  return Event('discount', {user: admin, product:product.id, percentage: percentage})
}
ctx.bthread('An admin can give products a discount of 10%, 25%, or 50%', ['User.admin', 'Product'], function (admin, product) {
  let percentage = choose([0.1, 0.25, 0.5])
  sync({request: discount(admin, product, percentage)})
})

