$(document).ready(function () {
  $(".coffee").addClass("americano");
});

$("#amuricano").on("click", function () {
  $(".foam").css("visibility", "hidden");
  $(".coffee").removeClass("water americano latte cappu foam");
  $(".coffee").addClass("americano");
});

$("#latte").on("click", function () {
  $(".foam").css("visibility", "hidden");
  $(".coffee").removeClass("water americano cappu latte");
  $(".coffee").addClass("latte");
});

$("#cappu").on("click", function () {
  $(".coffee").removeClass("water americano latte").addClass("cappu");
  $(".foam").css("visibility", "visible");
});

$("#water").on("click", function () {
  $(".coffee").removeClass("water americano latte cappi");
  $(".foam").css("visibility", "hidden");
  $(".coffee").addClass("water");
});