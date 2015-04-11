$(function () {
  var findPayment = function (principal, interest, years) {
      var interest = interest / 100;
      var payment = (principal * interest) / (1 - Math.pow(1 + interest, -years));
        //console.log("this is my payment ", payment);
      return payment;
    };

  var cashFlow = function(obj) {
    var monthly = findPayment(obj.principal, obj.interest / 12, obj.years * 12);
    console.log(monthly);
    obj.tax = obj.tax / 12;
    obj.insurance = obj.insurance / 12;
    console.log(obj.insurance);
    var cf = (obj.rent - monthly - obj.hoa - obj.tax - obj.insurance).toFixed(2);
    console.log("" + obj.rent + " - " + monthly + " - " + obj.hoa + " - " + obj.tax  + " - " + obj.insurance);
    return cf;
  };

  $("form.cf").on("submit", function (event) {
    event.preventDefault();
    var obj = {};
    $(this).serializeArray().forEach(function (el, id, arr) {
      obj[el.name] = Number(el.value);
    });
    $(".result").html("$" + cashFlow(obj) + " estimated monthly cash flow");

  });

});