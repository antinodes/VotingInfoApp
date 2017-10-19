(ns early-vote-site.election-detail.subs
  (:require [ajax.core :as ajax]
            [re-frame.core :as re-frame]))

(re-frame/reg-sub
 :selected-election
 (fn [db]
   (get-in db [:selected-election])))

(re-frame/reg-sub
 :election-detail/get
 (fn [db]
   (get-in db [:election-detail :detail])))