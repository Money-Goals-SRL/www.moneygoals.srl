# Money Goals SRL Official Website Source Code

This is the code of the official Money Goals SRL website. You can find the current website at
www.moneygoalssrl.com.

#### Changes from v1.0

##### 2024-02-28

-   Added button to toggle only current holdings and hystoric holdings of portfolio
-   Inserted links to Yahoo Finance page for every ticker in the Holdings page

##### Before 2024-02-28

-   Added getHoldings() JS code to manage transactions in Holdings page.
-   Added getFooter() JS code to render dynamic current year.
-   Improved home page element disposition.
-   Reordered elements in various pages.
-   Added legal disclaimer in home page.h

Now it is substantially easier for me to manually add data in the holding section, as transaction
and holding tables are populated automatically from the transactions I insert in the getHoldings()
file.
