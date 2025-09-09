import React from 'react';
import {useTranslations} from "next-intl";
import {Checkbox} from "@/components/ui/checkbox";
import {Label} from "@/components/ui/label";
import NotificationList from "@/components/layout/notification-list";

const NotificationDropdownContent = () => {
  const t = useTranslations("NotificationDropdownContent");
  return (
      <div>
        <section className={"flex items-baseline justify-between"}>
          <h2 className={"typo-head-4"}>
            {t("title")}
          </h2>
          <div className="flex items-center gap-3">
            <Checkbox id="terms"/>
            <Label htmlFor="terms">{t("markAll")}</Label>
          </div>
        </section>
        <NotificationList/>
      </div>

  );
};

export default NotificationDropdownContent;