package com.yaj.common.generate;



import java.io.*;

public class Test {
    public static void main(String[] args) throws IOException {
/*        List<TableInfo> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            TableInfo tableInfo =new TableInfo();
            tableInfo.setTableName(""+i);
            list.add(tableInfo);
        }
//        List<TableInfo> firstA = list.stream().filter(a->a.getTableName().equals("2")||a.getTableName().equals("3")).collect(Collectors.toList());
        List<TableConstant> firstA = list.stream()
                .filter(a->a.getTableName().equals("2")||a.getTableName().equals("3"))
                .map(t->{
                    TableConstant tableConstant = new TableConstant();
                    return tableConstant;
                })
                .collect(Collectors.toList());
        System.out.println(JSON.toJSONString(firstA));*/

       /* String str="123\n\r123\r\n132\rdfsf\n3243";

        InputStream inputStream = new ByteArrayInputStream(str.getBytes());
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        while (true) {
            str = reader.readLine();

            if(str!=null)
                System.out.println(str);
            else
                break;
        }*/


        String str = "    0   =    active      启用    ";
        System.out.println("1:"+str);
        System.out.println(str.trim());
        str=str.trim().replaceAll("\\s+"," ");
        System.out.println(str);
        System.out.println(str.split("=")[0].trim());
        System.out.println(str.split("=")[1].trim().split(" ")[0]);
        System.out.println(str.split("=")[1].trim().split(" ")[1]);
    }
}
