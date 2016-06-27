var Card = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    var target = $(e.target);
    target.closest('.card').toggleClass("selected");
    var details = target.closest('.card').find('.cardDetails');
    details.is(":visible") ? details.hide() : details.show();

    this.props.onSelectCard();
  },
  render: function(){
    return (
      <div className="card">
        <div className="cardMain">
          <a href="" onClick={this.handleClick}>{this.props.name}</a>
          <p className="pull-right">Credit Available : <b>£{this.props.creditAvailable}</b></p>
        </div>
        <div className="cardDetails">
          <p>Apr : {this.props.apr}</p>
          <p>Balance Transfer Offer Duration : {this.props.balanceTransferOfferDuration}</p>
          <p>Purchase Offer Duration : {this.props.purchaseOfferDuration}</p>
        </div>
      </div>
    )
  }
})

var CardList = React.createClass({
  render: function() {
    var that = this;
    var cardNodes = this.props.data.map(function(card) {
      return (
        <Card key={card.id} name={card.name} creditAvailable={card.creditAvailable} apr={card.apr}
          balanceTransferOfferDuration={card.balanceTransferOfferDuration}
          purchaseOfferDuration={card.purchaseOfferDuration} onSelectCard={that.props.onSelectCard} />
      );
    });
    return (
      <div className="cardList">
        {cardNodes}
      </div>
    );
  }
})

var CustomersDropdown = React.createClass({
  loadCustomersFromServer: function(){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCustomersFromServer();
  },
  handleSelectCustomer: function(e) {
    var name = e.target.value;
    var customer = this.state.data.filter(function(c){
      return c.name == name;
    });
    this.props.onSelectCustomer(customer[0].employmentStatus, customer[0].annualIncome);
  },
  render: function(){
    return (
      <div className="form-group">
        <select className="form-control" id="customer" onChange={this.handleSelectCustomer}>
          <option disabled selected>Select a customer:</option>
          {this.state.data.map(function(customer) {
            return <option key={customer.id}>{customer.name}</option>;
          })}
        </select>
      </div>
    );
  }
})

var CardsBox = React.createClass({
  loadCardsFromServer: function(status, income){
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      data: {status: status, income: income},
      success: function(data) {
        this.setState({cards: data.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });

    $('.card').each(function(i, v) {
      $(v).removeClass('selected').find('.cardDetails').hide();
    })

    this.updateCreditTotal();
  },
  updateCreditTotal: function(){
    var total = 0;
    var that = this;

    $('.card.selected').each(function(i, v) {
      var card = that.state.cards.filter(function(c){
        return c.name == $(v).find('a').text();
      });
      total += card[0].creditAvailable;
    })

    this.setState({creditTotal: total});
  },
  getInitialState: function() {
    return {cards: [], creditTotal: 0};
  },
  render: function(){
    return (
      <div className="cardBox">
        <h2>Crazy Cards Exercise</h2>
        <div className="row" id="customerPanel">
          <div className="col-xs-6">
            <CustomersDropdown url="get_customers" onSelectCustomer={this.loadCardsFromServer}/>
          </div>
          <div className="col-xs-6">
            <p className="pull-right" id="creditTotal">Total Credit Available : <b>£{this.state.creditTotal}</b></p>
          </div>
        </div>
        <CardList data={this.state.cards} onSelectCard={this.updateCreditTotal}/>
      </div>
    );
  }
})

ReactDOM.render(
    <CardsBox url="get_credit_cards" />,
    document.getElementById('content')
)