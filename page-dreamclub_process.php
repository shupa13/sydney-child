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
<?php $dream = explode(',',$_POST['dream']); ?>
<?php
  $sql = '
  SELECT * FROM dreamclub where LN ="'
  .$dream[0].'" and SZ ="'
  .$dream[1].'" and SM ="'
  .$dream[2].'" and HY ="'
  .$dream[3].'"';
  $result = mysqli_query($conn,$sql);
  $row = mysqli_fetch_array($result);
 ?>

<article class="game-box" style="max-width : 500px; margin: auto">
  <img class = "img_cell" src = "http://localhost:81/wordpress/wp-content/uploads/inner_thumbnail/dreamclub.jpg">
  <div style = "margin : 20px; border-top : 2px solid">
    <div>
      <img width = "10%" src ="http://localhost:81/wordpress/wp-content/uploads/emblem/<?= $row['club'] ?>.png" >
      <h4 style="display: inline-grid; margin: 20px 10px"><?= $row['club'] ?></h4>
    </div>
    <?php echo do_shortcode('[TheChamp-Sharing url="https://www.naver.com" style=""]') ?>
  </div>
</article>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
