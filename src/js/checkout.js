/**
 * Checkout Process Handler
 * Manages checkout form, validation, and order processing
 */
class CheckoutManager {
    constructor(cart) {
        this.cart = cart;
        this.currentStep = 1;
        this.maxSteps = 4;
        this.formData = {
            shipping: {},
            billing: {},
            payment: {},
            order: {}
        };
        
        this.bindEvents();
        this.initializeCheckout();
    }

    /**
     * Initialize checkout process
     */
    initializeCheckout() {
        this.renderCheckoutSteps();
        this.updateOrderSummary();
        this.setupFormValidation();
    }

    /**
     * Bind checkout events
     */
    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.checkout-next-btn')) {
                this.handleNextStep();
            }
            if (e.target.matches('.checkout-prev-btn')) {
                this.handlePreviousStep();
            }
            if (e.target.matches('.place-order-btn')) {
                this.handlePlaceOrder();
            }
            if (e.target.matches('.apply-discount-btn')) {
                this.handleApplyDiscount();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('.billing-same-as-shipping')) {
                this.handleBillingSameAsShipping(e.target.checked);
            }
            if (e.target.matches('.payment-method-radio')) {
                this.handlePaymentMethodChange(e.target.value);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.closest('.checkout-form')) {
                this.handleFormInput(e);
            }
        });
    }

    /**
     * Render checkout steps
     */
    renderCheckoutSteps() {
        const checkoutContainer = document.querySelector('#checkout-page .checkout-content');
        if (!checkoutContainer) return;

        checkoutContainer.innerHTML = `
            <div class="checkout-progress">
                <div class="progress-step ${this.currentStep >= 1 ? 'active' : ''}" data-step="1">
                    <div class="step-number">1</div>
                    <div class="step-label">Shipping</div>
                </div>
                <div class="progress-step ${this.currentStep >= 2 ? 'active' : ''}" data-step="2">
                    <div class="step-number">2</div>
                    <div class="step-label">Billing</div>
                </div>
                <div class="progress-step ${this.currentStep >= 3 ? 'active' : ''}" data-step="3">
                    <div class="step-number">3</div>
                    <div class="step-label">Payment</div>
                </div>
                <div class="progress-step ${this.currentStep >= 4 ? 'active' : ''}" data-step="4">
                    <div class="step-number">4</div>
                    <div class="step-label">Review</div>
                </div>
            </div>

            <div class="checkout-main">
                <div class="checkout-form-container">
                    ${this.renderCurrentStep()}
                </div>
                <div class="order-summary">
                    ${this.renderOrderSummary()}
                </div>
            </div>
        `;
    }

    /**
     * Render current checkout step
     */
    renderCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.renderShippingForm();
            case 2:
                return this.renderBillingForm();
            case 3:
                return this.renderPaymentForm();
            case 4:
                return this.renderOrderReview();
            default:
                return '';
        }
    }

    /**
     * Render shipping information form
     */
    renderShippingForm() {
        return `
            <div class="checkout-step active" data-step="1">
                <h2>Shipping Information</h2>
                <form class="checkout-form shipping-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="shipping-first-name">First Name *</label>
                            <input type="text" id="shipping-first-name" name="firstName" 
                                   value="${this.formData.shipping.firstName || ''}" required>
                            <div class="error-message"></div>
                        </div>
                        <div class="form-group">
                            <label for="shipping-last-name">Last Name *</label>
                            <input type="text" id="shipping-last-name" name="lastName" 
                                   value="${this.formData.shipping.lastName || ''}" required>
                            <div class="error-message"></div>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="shipping-email">Email Address *</label>
                        <input type="email" id="shipping-email" name="email" 
                               value="${this.formData.shipping.email || ''}" required>
                        <div class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="shipping-phone">Phone Number</label>
                        <input type="tel" id="shipping-phone" name="phone" 
                               value="${this.formData.shipping.phone || ''}">
                        <div class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="shipping-address">Street Address *</label>
                        <input type="text" id="shipping-address" name="address" 
                               value="${this.formData.shipping.address || ''}" required>
                        <div class="error-message"></div>
                    </div>
                    
                    <div class="form-group">
                        <label for="shipping-address2">Apartment, suite, etc.</label>
                        <input type="text" id="shipping-address2" name="address2" 
                               value="${this.formData.shipping.address2 || ''}">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="shipping-city">City *</label>
                            <input type="text" id="shipping-city" name="city" 
                                   value="${this.formData.shipping.city || ''}" required>
                            <div class="error-message"></div>
                        </div>
                        <div class="form-group">
                            <label for="shipping-state">State *</label>
                            <select id="shipping-state" name="state" required>
                                <option value="">Select State</option>
                                ${this.getStateOptions(this.formData.shipping.state)}
                            </select>
                            <div class="error-message"></div>
                        </div>
                        <div class="form-group">
                            <label for="shipping-zip">ZIP Code *</label>
                            <input type="text" id="shipping-zip" name="zip" 
                                   value="${this.formData.shipping.zip || ''}" required>
                            <div class="error-message"></div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="checkout-next-btn">Continue to Billing</button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Render billing information form
     */
    renderBillingForm() {
        return `
            <div class="checkout-step active" data-step="2">
                <h2>Billing Information</h2>
                <form class="checkout-form billing-form">
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" class="billing-same-as-shipping" 
                                   ${this.formData.billing.sameAsShipping ? 'checked' : ''}>
                            Same as shipping address
                        </label>
                    </div>
                    
                    <div class="billing-fields ${this.formData.billing.sameAsShipping ? 'hidden' : ''}">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="billing-first-name">First Name *</label>
                                <input type="text" id="billing-first-name" name="firstName" 
                                       value="${this.formData.billing.firstName || ''}" required>
                                <div class="error-message"></div>
                            </div>
                            <div class="form-group">
                                <label for="billing-last-name">Last Name *</label>
                                <input type="text" id="billing-last-name" name="lastName" 
                                       value="${this.formData.billing.lastName || ''}" required>
                                <div class="error-message"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="billing-address">Street Address *</label>
                            <input type="text" id="billing-address" name="address" 
                                   value="${this.formData.billing.address || ''}" required>
                            <div class="error-message"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="billing-address2">Apartment, suite, etc.</label>
                            <input type="text" id="billing-address2" name="address2" 
                                   value="${this.formData.billing.address2 || ''}">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="billing-city">City *</label>
                                <input type="text" id="billing-city" name="city" 
                                       value="${this.formData.billing.city || ''}" required>
                                <div class="error-message"></div>
                            </div>
                            <div class="form-group">
                                <label for="billing-state">State *</label>
                                <select id="billing-state" name="state" required>
                                    <option value="">Select State</option>
                                    ${this.getStateOptions(this.formData.billing.state)}
                                </select>
                                <div class="error-message"></div>
                            </div>
                            <div class="form-group">
                                <label for="billing-zip">ZIP Code *</label>
                                <input type="text" id="billing-zip" name="zip" 
                                       value="${this.formData.billing.zip || ''}" required>
                                <div class="error-message"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="checkout-prev-btn">Back to Shipping</button>
                        <button type="button" class="checkout-next-btn">Continue to Payment</button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Render payment form
     */
    renderPaymentForm() {
        return `
            <div class="checkout-step active" data-step="3">
                <h2>Payment Information</h2>
                <form class="checkout-form payment-form">
                    <div class="payment-methods">
                        <div class="payment-method">
                            <label class="radio-label">
                                <input type="radio" name="paymentMethod" value="credit" 
                                       class="payment-method-radio" ${this.formData.payment.method === 'credit' ? 'checked' : ''}>
                                <span class="radio-custom"></span>
                                Credit Card
                            </label>
                        </div>
                        <div class="payment-method">
                            <label class="radio-label">
                                <input type="radio" name="paymentMethod" value="paypal" 
                                       class="payment-method-radio" ${this.formData.payment.method === 'paypal' ? 'checked' : ''}>
                                <span class="radio-custom"></span>
                                PayPal
                            </label>
                        </div>
                        <div class="payment-method">
                            <label class="radio-label">
                                <input type="radio" name="paymentMethod" value="apple" 
                                       class="payment-method-radio" ${this.formData.payment.method === 'apple' ? 'checked' : ''}>
                                <span class="radio-custom"></span>
                                Apple Pay
                            </label>
                        </div>
                    </div>
                    
                    <div class="credit-card-form ${this.formData.payment.method !== 'credit' ? 'hidden' : ''}">
                        <div class="form-group">
                            <label for="card-number">Card Number *</label>
                            <input type="text" id="card-number" name="cardNumber" 
                                   placeholder="1234 5678 9012 3456" maxlength="19" required>
                            <div class="error-message"></div>
                        </div>
                        
                        <div class="form-group">
                            <label for="card-name">Name on Card *</label>
                            <input type="text" id="card-name" name="cardName" 
                                   value="${this.formData.payment.cardName || ''}" required>
                            <div class="error-message"></div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="card-expiry">Expiry Date *</label>
                                <input type="text" id="card-expiry" name="cardExpiry" 
                                       placeholder="MM/YY" maxlength="5" required>
                                <div class="error-message"></div>
                            </div>
                            <div class="form-group">
                                <label for="card-cvv">CVV *</label>
                                <input type="text" id="card-cvv" name="cardCVV" 
                                       placeholder="123" maxlength="4" required>
                                <div class="error-message"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="discount-section">
                        <h3>Discount Code</h3>
                        <div class="discount-input">
                            <input type="text" id="discount-code" placeholder="Enter discount code">
                            <button type="button" class="apply-discount-btn">Apply</button>
                        </div>
                        <div class="discount-message"></div>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="checkout-prev-btn">Back to Billing</button>
                        <button type="button" class="checkout-next-btn">Review Order</button>
                    </div>
                </form>
            </div>
        `;
    }

    /**
     * Render order review
     */
    renderOrderReview() {
        const cartSummary = this.cart.getSummary();
        
        return `
            <div class="checkout-step active" data-step="4">
                <h2>Review Your Order</h2>
                <div class="order-review">
                    <div class="review-section">
                        <h3>Shipping Address</h3>
                        <div class="review-content">
                            ${this.formData.shipping.firstName} ${this.formData.shipping.lastName}<br>
                            ${this.formData.shipping.address}<br>
                            ${this.formData.shipping.address2 ? this.formData.shipping.address2 + '<br>' : ''}
                            ${this.formData.shipping.city}, ${this.formData.shipping.state} ${this.formData.shipping.zip}<br>
                            ${this.formData.shipping.phone}
                        </div>
                    </div>
                    
                    <div class="review-section">
                        <h3>Payment Method</h3>
                        <div class="review-content">
                            ${this.getPaymentMethodDisplay()}
                        </div>
                    </div>
                    
                    <div class="review-section">
                        <h3>Order Items</h3>
                        <div class="review-items">
                            ${cartSummary.items.map(item => `
                                <div class="review-item">
                                    <img src="${item.image}" alt="${item.name}" class="review-item-image">
                                    <div class="review-item-details">
                                        <h4>${item.name}</h4>
                                        ${Object.keys(item.variant).length > 0 ? `
                                            <div class="review-item-variants">
                                                ${Object.entries(item.variant).map(([key, value]) => 
                                                    `${key}: ${value}`
                                                ).join(', ')}
                                            </div>
                                        ` : ''}
                                        <div class="review-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                                    </div>
                                    <div class="review-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="terms-section">
                        <label class="checkbox-label">
                            <input type="checkbox" id="terms-agree" required>
                            I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a>
                        </label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="checkout-prev-btn">Back to Payment</button>
                        <button type="button" class="place-order-btn">Place Order</button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render order summary
     */
    renderOrderSummary() {
        const cartSummary = this.cart.getSummary();
        
        return `
            <h3>Order Summary</h3>
            <div class="summary-items">
                ${cartSummary.items.map(item => `
                    <div class="summary-item">
                        <span class="item-name">${item.name} × ${item.quantity}</span>
                        <span class="item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            
            <div class="summary-totals">
                <div class="summary-line">
                    <span>Subtotal:</span>
                    <span>$${cartSummary.subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Shipping:</span>
                    <span>${cartSummary.shipping === 0 ? 'FREE' : '$' + cartSummary.shipping.toFixed(2)}</span>
                </div>
                <div class="summary-line">
                    <span>Tax:</span>
                    <span>$${cartSummary.tax.toFixed(2)}</span>
                </div>
                ${this.cart.discount ? `
                    <div class="summary-line discount">
                        <span>Discount (${this.cart.discount.code}):</span>
                        <span>-$${this.cart.discount.amount.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="summary-line total">
                    <span>Total:</span>
                    <span>$${(this.cart.discount ? this.cart.getDiscountedTotal() : cartSummary.total).toFixed(2)}</span>
                </div>
            </div>
        `;
    }

    /**
     * Handle next step
     */
    handleNextStep() {
        if (this.validateCurrentStep()) {
            this.saveCurrentStepData();
            if (this.currentStep < this.maxSteps) {
                this.currentStep++;
                this.renderCheckoutSteps();
                this.updateOrderSummary();
            }
        }
    }

    /**
     * Handle previous step
     */
    handlePreviousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderCheckoutSteps();
        }
    }

    /**
     * Validate current step
     */
    validateCurrentStep() {
        const currentForm = document.querySelector('.checkout-step.active form');
        if (!currentForm) return true;

        const requiredFields = currentForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const errorElement = field.parentElement.querySelector('.error-message');
            
            if (!field.value.trim()) {
                this.showFieldError(field, 'This field is required');
                isValid = false;
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            } else if (field.name === 'zip' && !this.isValidZip(field.value)) {
                this.showFieldError(field, 'Please enter a valid ZIP code');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    /**
     * Save current step data
     */
    saveCurrentStepData() {
        const currentForm = document.querySelector('.checkout-step.active form');
        if (!currentForm) return;

        const formData = new FormData(currentForm);
        const stepData = {};

        for (let [key, value] of formData.entries()) {
            stepData[key] = value;
        }

        switch (this.currentStep) {
            case 1:
                this.formData.shipping = { ...this.formData.shipping, ...stepData };
                break;
            case 2:
                this.formData.billing = { ...this.formData.billing, ...stepData };
                break;
            case 3:
                this.formData.payment = { ...this.formData.payment, ...stepData };
                break;
        }
    }

    /**
     * Handle place order
     */
    async handlePlaceOrder() {
        const termsCheckbox = document.querySelector('#terms-agree');
        if (!termsCheckbox.checked) {
            alert('Please agree to the terms and conditions');
            return;
        }

        const orderButton = document.querySelector('.place-order-btn');
        orderButton.disabled = true;
        orderButton.textContent = 'Processing...';

        try {
            const orderResult = await this.processOrder();
            this.showOrderConfirmation(orderResult);
        } catch (error) {
            this.showOrderError(error.message);
        } finally {
            orderButton.disabled = false;
            orderButton.textContent = 'Place Order';
        }
    }

    /**
     * Process order (mock implementation)
     */
    async processOrder() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock payment processing
                const success = Math.random() > 0.1; // 90% success rate
                
                if (success) {
                    const orderId = 'ORD-' + Date.now();
                    const orderData = {
                        id: orderId,
                        items: this.cart.getSummary().items,
                        shipping: this.formData.shipping,
                        billing: this.formData.billing,
                        payment: this.formData.payment,
                        total: this.cart.discount ? this.cart.getDiscountedTotal() : this.cart.getTotal(),
                        status: 'confirmed',
                        estimatedDelivery: this.calculateDeliveryDate(),
                        createdAt: new Date().toISOString()
                    };
                    
                    // Clear cart after successful order
                    this.cart.clear();
                    
                    resolve(orderData);
                } else {
                    reject(new Error('Payment processing failed. Please try again.'));
                }
            }, 2000);
        });
    }

    /**
     * Show order confirmation
     */
    showOrderConfirmation(orderData) {
        const checkoutContainer = document.querySelector('#checkout-page .checkout-content');
        
        checkoutContainer.innerHTML = `
            <div class="order-confirmation">
                <div class="confirmation-icon">✓</div>
                <h2>Order Confirmed!</h2>
                <p>Thank you for your purchase. Your order has been placed successfully.</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <div class="detail-row">
                        <span>Order Number:</span>
                        <span><strong>${orderData.id}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span>Total Amount:</span>
                        <span><strong>$${orderData.total.toFixed(2)}</strong></span>
                    </div>
                    <div class="detail-row">
                        <span>Estimated Delivery:</span>
                        <span><strong>${orderData.estimatedDelivery}</strong></span>
                    </div>
                </div>
                
                <div class="confirmation-actions">
                    <button class="nav-link" data-page="products">Continue Shopping</button>
                    <button onclick="window.print()">Print Receipt</button>
                </div>
            </div>
        `;
    }

    /**
     * Show order error
     */
    showOrderError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'order-error';
        errorDiv.textContent = message;
        
        const orderReview = document.querySelector('.order-review');
        orderReview.insertBefore(errorDiv, orderReview.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    /**
     * Handle form input changes
     */
    handleFormInput(event) {
        // Clear error on input
        this.clearFieldError(event.target);
        
        // Format specific fields
        if (event.target.name === 'cardNumber') {
            event.target.value = this.formatCardNumber(event.target.value);
        } else if (event.target.name === 'cardExpiry') {
            event.target.value = this.formatCardExpiry(event.target.value);
        }
    }

    /**
     * Handle billing same as shipping
     */
    handleBillingSameAsShipping(checked) {
        this.formData.billing.sameAsShipping = checked;
        
        const billingFields = document.querySelector('.billing-fields');
        if (billingFields) {
            billingFields.classList.toggle('hidden', checked);
        }
        
        if (checked) {
            // Copy shipping data to billing
            this.formData.billing = {
                ...this.formData.shipping,
                sameAsShipping: true
            };
        }
    }

    /**
     * Handle payment method change
     */
    handlePaymentMethodChange(method) {
        this.formData.payment.method = method;
        
        const creditCardForm = document.querySelector('.credit-card-form');
        if (creditCardForm) {
            creditCardForm.classList.toggle('hidden', method !== 'credit');
        }
    }

    /**
     * Handle apply discount
     */
    handleApplyDiscount() {
        const discountInput = document.querySelector('#discount-code');
        const discountMessage = document.querySelector('.discount-message');
        const code = discountInput.value.trim();
        
        if (!code) {
            discountMessage.textContent = 'Please enter a discount code';
            discountMessage.className = 'discount-message error';
            return;
        }
        
        // Mock discount codes
        const validCodes = {
            'SAVE10': 10,
            'WELCOME20': 20,
            'FIRST15': 15
        };
        
        if (validCodes[code.toUpperCase()]) {
            const discount = this.cart.applyDiscount(code.toUpperCase(), validCodes[code.toUpperCase()]);
            discountMessage.textContent = `Discount applied! You saved $${discount.amount.toFixed(2)}`;
            discountMessage.className = 'discount-message success';
            this.updateOrderSummary();
        } else {
            discountMessage.textContent = 'Invalid discount code';
            discountMessage.className = 'discount-message error';
        }
    }

    /**
     * Update order summary
     */
    updateOrderSummary() {
        const summaryContainer = document.querySelector('.order-summary');
        if (summaryContainer) {
            summaryContainer.innerHTML = this.renderOrderSummary();
        }
    }

    /**
     * Utility methods
     */
    getStateOptions(selectedState = '') {
        const states = [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
            'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
            'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
            'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
            'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ];
        
        return states.map(state => 
            `<option value="${state}" ${state === selectedState ? 'selected' : ''}>${state}</option>`
        ).join('');
    }

    getPaymentMethodDisplay() {
        switch (this.formData.payment.method) {
            case 'credit':
                return `Credit Card ending in ${this.formData.payment.cardNumber?.slice(-4) || '****'}`;
            case 'paypal':
                return 'PayPal';
            case 'apple':
                return 'Apple Pay';
            default:
                return 'Not selected';
        }
    }

    calculateDeliveryDate() {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 5);
        return deliveryDate.toLocaleDateString();
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidZip(zip) {
        return /^\d{5}(-\d{4})?$/.test(zip);
    }

    formatCardNumber(value) {
        return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    }

    formatCardExpiry(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
    }

    showFieldError(field, message) {
        field.classList.add('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    setupFormValidation() {
        // Setup real-time validation as user types
        const forms = document.querySelectorAll('.checkout-form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input[required]');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (input.value.trim()) {
                        this.clearFieldError(input);
                    }
                });
            });
        });
    }
}

// Export for use in other modules
window.CheckoutManager = CheckoutManager;