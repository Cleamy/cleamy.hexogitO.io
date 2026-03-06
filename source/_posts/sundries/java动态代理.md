---
title: java动态代理
date: 2024-05-02 22:57:03
tags:  
    - java
    - proxy
categories:
    - java
    - proxy
description: 具体内容点击查看
swiper_index: 2
---


## 动态代理： 基于反射机制
1. 什么是动态代理
2. 知道动态代理能做什么

+ 代理含义
  + 代理模式是指，为其他对象提供一种代理以控制对这个对象的访问，
  + 在某些情况下，一个对象不适合或者不能直接应用另一个对象，
  + 而代理对象可以在客户类和目标对象之间起到中介的作用
    + 代理对象，是为了不修改在目标对象的基础上，增强主业务逻辑。
    + 客户真正想要访问的目标对象是通过代理对象来实现的
    + 代理类与目标类实现同一接口
  + 代理模式的作用
    + 1、功能增强：在原有的功能的基础上，增加了额外的功能，新增增加的功能，叫做功能增强
    + 2、控制访问：代理类代替客户类对目标对象进行访问，目标对象无法直接被客户类访问，需通过代理类访问
  + 实现代理的方式
    + 1、静态代理： 
      + 代理类是自己手工实现的，自己创建一个java类，表示代理类
      + 同时你所要使用代理的目标类是确定的 
        + 特点：实现简单，容易理解
        + 例题：模拟用户购买u盘的行为
          + 用户是客户端类，商家是代理类，产家是目标对象
          + 用户--访问-->商家--访问-->产家
          + 其中商家和产家都是买u盘的，他们的功能是一致的
            + 实现方式：
              + 1、创建一个接口：定义卖u盘的方法，表示你的产家和商家做的事情
              + 2、创建产家，实现1步骤的接口
              + 3、创建商家，就是代理，也需要实现步骤1中的接口
              + 4、创建一个客户端类，调用商家的方法买一个u盘
      + 缺点：
        + 1、当目标类增强了，代理类可能会导致成倍的增加，代理类数量修改过多
        + 2、当接口中的功能增加了，或则修改了，会影响众多的实现类
    + 2、动态代理：
      + 在静态代理目标类众多，可以使用动态代理
      + 优点：目标类即使众多，代理数量可以很少
      + 当接口的方法修改时，不会影响代理类
      + 定义：
        + 在程序的执行中，使用jdk的反射机制，来创建代理类对象，并动态指定要代理的目标类
      + 动态代理需要使用到反射，
        + 反射：允许对成员变量、成员方法和构造方法的信息进行编程访问
        + 反射 可以 获取 字段（成员变量）、构造方法、成员方法
          + 1、显示从字节码class文件获取 类从内部成员等信息
          + 2、对信息进行揭破
            + 1、获取class对象的三种方式
              + ①：Class.forName("全类名");// 源代码阶段
              + ②：类名.class;// 加载阶段
              + ③：对象.getClass();// 运行阶段
          + 获取类的内部信息
            + 1、获取构造方法（Constructor）
              + 1、Constructor<?>[]getConstructors : 获取所有公共构造方法对象的数组
              + 2、Constructor<?>[]getDeclaredConstructors() : 返回所有构造方法对象的数组
              + 3、Constructor<T>getConstructor(Class<?> ... parameterTypes); 返回单个公共构造方法对象
              + 4、Constructor<T>getDeclaredConstructor(Class<?> ...parameterTypes); 返回单个构造方法对象
                + Constructor 类中用于创建对象的方法
                + T newinstance（Object initargs）根据指定的钩爪方法创建对象
                + setAccessible(boolean flag) ： 设置为true 表示取消访问检查
            + 2、获取成员变量
              + Field[] getFields() ：返回所有公共成员变量对象的数组
              + field[] getDeclaredFields()：返回成员变量的对象数组
              + Field getField(String name); 返回单个公共成员变量
              + field getDeclaredField(String name)：返回单个成员对象
                + field类中用创建的对象的方法
                  + void set（obejct obj,Object value): 赋值
                  + object get(Object) 获取值
            + 3、获取成员方法
              + Method[] getmethods()：返回所有公共成员方法对象，包括继承类的
              + method[] getDeclaredMethods(): 返回所有成员方法对象的数组，不包括继承类
              + method getMethod(String name,Class<?> ...parameterTypes): 返回单个公共成员方法对象
              + method getDeclaredMethod(String name,Class<?> ...parameterTypes)：返回单个成员方法对象
                + method类中用于创建对象的方法
                  + Object invoke(Object obj,Object ...args): 运行方法
                + 参数一：用obj对象调用该方法
                + 参数二：调用方法的传递的参数（如果没有为空）
                + 返回值：方法的返回值（没有为空）
      + 回归动态代理，动态代理需要使用到反射的机制进行处理代理类，目标类，接口之间的关系
        + 动态代理的实现方式有两种：
          + 1、jdk动态代理：使用java反射包中的类和接口的实现动态代理的功能
            + java.lang.reflect ,里面有有三个类：invocationHandler、method、Proxy
          + 2、cglib动态代理
            + cglib是第三方的工具库，创建代理对象
            + cglib的原理是继承，cglib通过继承目标类，创建它的子类，在子类中
            + 重写父类中同名的方法，实现功能的修改
            + 要求目标类和方法都不能是final的
        + jdk动态代理实现：
          + invocationHandler（调用处理器）：接口，就一个方法invoke()
            + invoke():表示代理对象要执行的功能代码，你的代理类要写在invoke中
              + 代理类要完成的功能
                + 1、条用目标方法，执行目标方法的功能
                + 2、功能增强
              + 方法的原型
                + public Object invoke(Object proxy, Method method,Object[]args)
                  + Object proxy:jdk创建的代理对象，无需赋值
                  + Method method：目标类中的方法
                  + Object[] args：形参的参数值
                  +  将原来静态代理类做的事情写在invoke中
          + Method 类; 表示方法，确切的是目标类中的方法
            + 作用，通过method可以执行某个目标类总的方法：method.invoke(执行方法的对象，方法形参值);
          + Proxy类： 核心的对象，创建代理对象，之前创建对象 new 类 的构造方法（）
            + 现在是使用Proxy类的方法，代替new的使用
            + 使用 Proxy.newProxyInstance() 创建目标类的代理对象
            + public static Object newProxyInstance(ClassLoader loader,Class<?> [] interfaces, invocationHandler h）
                + 参数
                + 1、ClassLoader loader 类加载器，负责向内存加载创建对象，使用反射机制获取Loader
                  + 这是目标对象的加载器
                  + 类a Class.forName('a类的全限定名").getClassLoader() 获取 a 的字节码文件在获得加载器
                + 2、Class<?>[]interface: 目标对象实现的接口，也是反射获取
                  + 类a class.forName("类a的全全限定名").getInterfaces() 获取所有目标对象实现的接口
                + 3、InvocationHandler : 是需要实现的功能，使用之前的InvocationHandler接口 的invoke 一样
                + 返回值：是目标对象的代理对象 Proxy
        + 1、实现动态代理的步骤
          + 1、创建接口，定义目标类的完成的功能
          + 2、创建目标类实现接口
          + 3、创建InvocationHandler接口的实现昂类，在invoke方法中要完成代理的 功能
            + 1、调用目标方法
            + 2、增强功能
          + 4、使用Proxy类的静态方法，创建代理对象，并把返回值转为接口类型