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
<?php $conn = sql_connect();?>
<article class="game-box dream">
  <h3 class="dream_category">BIRTHDAY</h3>
  <div class="game-container dreamclub">
    <img class="img_cell dream" src="http://localhost:81/wordpress/wp-content/uploads/dreamclub/party.png" onclick="select_dream('party')">
    <img class="img_cell dream" src="http://localhost:81/wordpress/wp-content/uploads/dreamclub/club.png" onclick="select_dream('club')">
  </div>
</article>
<?php get_sidebar(); ?>
<?php get_footer(); ?>
