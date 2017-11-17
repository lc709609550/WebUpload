<?php

//洗牌
function wash_card($card_num){
        $cards = $temp = array();

        for ($i=0; $i <$card_num ; $i++) {
            $temp[$i] = $i; 
         }

         for ($i=0; $i < $card_num; $i++) { 
              $index = rand(0,$card_num-$i-1);
              $cards[$i] = $temp[$index];
              unset($temp[$index]);
              $temp = array_values($temp);
         }

         return array_values($cards);
    }

    //快排
    function quickSort(Array &$arr, $start, $end) {
          $low = $start;
          $high = $end;
          
         #同时移动low和high,low找比$arr[$start]大的元素,high找比$arr[$start]小的元素
         #交换大小元素位置,知道low=high
         while($low != $high) {
             while($arr[$low] <= $arr[$start] && $low != $high) {
                 ++$low;
             }
             while($arr[$high] >= $arr[$start] && $low != $high) {
                 --$high;
             }
             $temp = $arr[$low];
             $arr[$low] = $arr[$high];
             $arr[$high] = $temp;
         }
         
         #如果low和high指向的元素小于$arr[$start],交换$arr[$start]和这个元素
         #否则交换$arr[$start]和low指向的前一个元素,然后进入递归
         if($low != $start && $arr[$low] > $arr[$start]) $low--;
         $temp = $arr[$low];
         $arr[$low] = $arr[$start];
         $arr[$start] = $temp;
         
         #递归中止条件是切分后的部分只剩下一个元素
         if($low - 1 > $start) quickSort($arr, $start, $low - 1);
         if($low + 1 < $end) quickSort($arr, $low + 1, $end);
     }
?>