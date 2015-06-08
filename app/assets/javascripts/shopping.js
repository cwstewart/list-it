$(function(){
  $("#begin-shopping").on('click', function() {
    shopping.beginShopping();
  });

  $('.buttons').on('click', '.got-it, .skip-it', function (e) {
    e.preventDefault();

    var status = $(this)[0].className;
    var url = $(this).parent().parent().data('item-url');

    if(status == "got-it"){
      shopping.slideItem("left");
      shopping.updateItem(url, "purchased");
    }
    else{
      shopping.slideItem("right");
      shopping.updateItem(url, "skipped");
    }
  });

  $('#submit-list').on('click', function(){
    shopping.submitList();
  });
});


var shopping = (function(){
  var path = window.location.pathname;

  return{
    beginShopping: beginShopping,
    updateItem: updateItem,
    submitList: submitList,
    slideItem: slideItem
  }

  function beginShopping(){
    fadeInFadeOut();

  }

  function fadeInFadeOut(){
    $('.item').first().fadeIn(700);
    $('.item').first().addClass("current");
    $('#begin-shopping').hide();
  }

  function slideItem(direction){
    var nextSib = $('.current').next();
    $('.current').hide('slide', {direction: direction}, 700);
    setTimeout(function(){
      $(nextSib).fadeIn(500);
    }, 700);

    $('.current').removeClass('current');
    $(nextSib).addClass('current');
  }

  function updateItem(url, status){
    $.ajax({
      type: "PATCH",
      url: url,
      data: {item: {status: status}},
    }).done(function(){
      updateReviewList();
    }).error(function(xhr, ajaxOptions, thrownError){
      console.log("error");
    });
  }

  function updateReviewList(){
    $('.list-review ul').load(path + " .list-review ul");
  }

  function submitList(){
    var slug = $('.list-review').data('list-url');
    var url = slug+'/submit';

    var skippedItems = [];

    $.get(url, function(items){
      $(items).each(function(){
        var item = $(this)[0];
        var itemStatus = item.status;
        if(itemStatus == "skipped"){
          skippedItems.push(item);
        }
      });
      sendSkippedItemsEmail(skippedItems)
    });
  }

  function sendSkippedItemsEmail(skippedItems){
    $.ajax({
      url: path,
      method: "POST",
      data: {items: skippedItems}
    }).done(function(){
    }).error(function(){
      console.log("error");
    });
  }

})();
