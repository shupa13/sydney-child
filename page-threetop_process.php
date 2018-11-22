<?php
/**
 * The template for displaying all pages.
 *
 * This is the template that displays all pages by default.
 * Please note that this is the WordPress construct of pages
 * and that other 'pages' on your WordPress site will use a
 * different template.
 *
 * @package Sydney
 */

get_header(); ?>
<?php require('lib/print.php'); ?>
<?php $conn = sql_connect(); ?>
<?php
  $my_list = explode(',', $_POST['player_list']);
  // DB 에 데이터 입력
  $sql = '
      UPDATE threemid SET vote = vote+1
      where name = "'.$my_list[0].'"
      or name = "'.$my_list[1].'"
      or name = "'.$my_list[2].'"';
  $result = mysqli_query($conn, $sql);

  // 총 참여자 수 계산
  $sql = '
      SELECT SUM(vote) from threemid';
  $result = mysqli_query($conn, $sql);
  $row = mysqli_fetch_array($result);
  $participants = intval($row['SUM(vote)'])/3;

  // 조합계산
  $sql = '
      SELECT * FROM threemid
      where name = "'.$my_list[0].'"
      or name = "'.$my_list[1].'"
      or name = "'.$my_list[2].'"
      ORDER BY code';
  $result = mysqli_query($conn, $sql);

  $code = "";
  $my_list = array();
  while ($row = mysqli_fetch_array($result)) {
    $code = $code.$row['code'];
    array_push($my_list, $row['name']);
  }
  $sql = '
      UPDATE threemid_combi SET vote = vote+1
      WHERE combi = "'.$code.'"';
  $result = mysqli_query($conn, $sql);
 ?>
 <?php
   $arr = array();
   array_push($arr, threemid_data_get('ALL',$conn));
   array_push($arr, threemid_data_get(5,$conn));
   array_push($arr, threemid_data_get(3,$conn));
   array_push($arr, threemid_data_get(2,$conn));
   $comb = threemid_com($conn);
  ?>

 <article class="game-box threetop">
   <h3 class="extra_money res">Best Midfield Combination <font color='yellow'>10 $</font></h3>
   <div class="game-container threetop_res">
     <?php
        for($i=0; $i<count($my_list); $i++){
          ?>
          <div style="display: grid">
            <img class = "img_cell result" src = "http://localhost:81/wordpress/wp-content/uploads/threemid/<?= $my_list[$i]; ?>.png">
            <h6><?= $my_list[$i] ?></h6>
          </div>
          <?php
        }
      ?>
   </div>
   <?php echo do_shortcode('[TheChamp-Sharing url="https://www.naver.com" style=""]') ?>
   <div class="vote-menu">
     <button type="button" id = "vote_A" value =<?= $arr[0] ?> onclick="vote_category(this)">ALL</button>
     <button type="button" id = "vote_5" value =<?= $arr[1] ?> onclick="vote_category(this)">5$</button>
     <button type="button" id = "vote_3" value =<?= $arr[2] ?> onclick="vote_category(this)">3$</button>
     <button type="button" id = "vote_2" value =<?= $arr[3] ?> onclick="vote_category(this)">2$</button>
     <button type="button" id = "vote_C" value =<?= $comb ?> onclick="vote_combi(this)">COMBI</button>
   </div>
   <div class="mid_category"></div>
   <input type="hidden" id = "total_participants" value=<?= $participants ?>>
 </article>




 <?php
  function threemid_data_get($cost, $conn){
    $arr = array();
    if($cost == 'ALL'){
      $sql = '
        SELECT * FROM threemid ORDER BY vote DESC';
    }else {
      $sql = '
        SELECT * FROM threemid WHERE cost ='.$cost.' ORDER BY vote DESC';
    }
    $result = mysqli_query($conn, $sql);
    for($i=0; $i<6; $i++){
      $row = mysqli_fetch_array($result);
      $temp_arr = array(
        'name' => $row['name'],
        'vote' => $row['vote']
      );
      array_push($arr, $temp_arr);
    }
    return json_encode($arr);
  }

  function threemid_com($conn){
    $arr = array();
    $sql = '
      SELECT * FROM threemid_combi ORDER BY vote DESC';
    $result = mysqli_query($conn, $sql);

    for($i=0; $i<6; $i++){
      $row = mysqli_fetch_array($result);
      $sql2 = '
        SELECT name FROM threemid
        where CODE ="'.$row['combi'][0].'"
        or CODE = "'.$row['combi'][1].'"
        or CODE = "'.$row['combi'][2].'"
        ';
      $result2 = mysqli_query($conn, $sql2);

      $temp_name_arr = array();
      while ($row2 = mysqli_fetch_array($result2)['name']) {
        array_push($temp_name_arr, $row2);
      }

      $temp_arr = array(
        'combi' => $temp_name_arr,
        'vote' => $row['vote']
      );
      array_push($arr, $temp_arr);
    }
    return json_encode($arr);
  }
  ?>

 <?php get_sidebar(); ?>
 <?php get_footer(); ?>
