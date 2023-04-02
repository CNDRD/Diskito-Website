import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient('https://leyoegxpprcdstxvtecg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleW9lZ3hwcHJjZHN0eHZ0ZWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk5NDA1NDIsImV4cCI6MTk5NTUxNjU0Mn0.yNr2o0psosNcfQX52uoOZc7pvn0YzysqpgdCE-f2kFM')
export const c = console.log.bind(console);

const { data: authData } = await supabase.auth.getSession();
export const UUID = authData.session ? authData.session.user.id : null;
export const userAuth = authData;

if (authData.session) {
  toggleLoggedIn(true);
} else {
  toggleLoggedIn(false);
}

export async function settings(sysid=undefined) {
  const { data: settings, error: settingsError } = await supabase.from('settings').select('*');
  if (settingsError) { c(settingsError); return false; }
  if (sysid) { return settings.find(x => x.sysid === sysid); }
  return settings;
};

let theme = localStorage.getItem('theme');
if (theme) { changeTheme(theme); }

$(document).ready(function(){

  function toggleMobileNavbar() {
    $("#hidden").slideToggle(150);
    $("#restt").fadeToggle(150);
  };

  $("#menu").click(() => toggleMobileNavbar());
  $("#restt").click(() => toggleMobileNavbar());

  $(".theme-switch").click(function(){
    changeTheme(this.innerHTML);
  });

  $('.login-button:not(.logout)').click(() => supabase.auth.signInWithOAuth({ provider: 'discord' }));
  $('.login-button.logout').click(() => { supabase.auth.signOut(); toggleLoggedIn(false); });

});

function changeTheme(toWhat) {
  
  switch ( toWhat ) {
    case "☀️":
    case "Light Mode":
      $("#theme-switch").text("🌑");
      $("#mobile-theme-switch").text("Dark Mode");
      localStorage.setItem("theme", "☀️");
      document.documentElement.style.setProperty("--background-color", "hsl(46, 100%, 97%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(212, 33%, 23%)");
      $("html").removeClass("dark-mode");
      break;
    case "🌑":
    case "Dark Mode":
      $("#theme-switch").text("☀️");
      $("#mobile-theme-switch").text("Light Mode");
      localStorage.setItem("theme", "🌑");
      document.documentElement.style.setProperty("--background-color", "hsl(212, 33%, 23%)");
      document.documentElement.style.setProperty("--chaun-blue", "hsl(46, 100%, 97%)");
      $("html").addClass("dark-mode");
      break;
  };

};

function toggleLoggedIn(inOut) {
  if (inOut) {
    $(".login-button").addClass("logout").text("Logout");
    $('html').attr('data-logged-in', true);
  }
  else {
    $(".login-button").removeClass("logout").text("Login");
    $('html').attr('data-logged-in', false);
  }
};

$.get("/resources/html/navbar-links.html", (data) => {
  $(data).insertBefore("#hidden .login-button");
  $(".navigation").append(data);
});
