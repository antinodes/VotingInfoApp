(ns early-vote-site.early-vote-site-list.views
  (:require [re-frame.core :as re-frame]))

(defn site->row [site]
  [:tr {:key (:id site)}
   [:td (:county-fips site)]
   [:td (:type site)]
   [:td (:name site)]
   [:td (:address-1 site)]
   [:td (:city site)]
   [:td "Buttons here"]])

(defn early-vote-sites-list [site-list]
  [:div
   [:table {:name "early-vote-sites-list"}
    [:thead
     [:tr {:key "early-vote-sites-head-row"}
      [:th {:name "early-vote-site-fips"} "FIPS"]
      [:th {:name "early-vote-site-type"} "Type"]
      [:th {:name "early-vote-site-location-name"} "Location Name"]
      [:th {:name "early-vote-site-address-1"} "Address Line 1"]
      [:th {:name "early-vote-site-city"} "City"]
      [:th {:name "early-vote-site-action"} "Action"]]]
    (if (seq @site-list)
      [:tbody
       (map site->row @site-list)]
      [:tbody
       [:tr [:td {:colSpan 6} "No Early Vote Sites"]]])]
   [:button.button {:on-click #(re-frame/dispatch [:navigate/early-vote-form])}
    "Create an Early Vote Site"]])
